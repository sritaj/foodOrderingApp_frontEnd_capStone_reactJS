import React, { Component } from "react";
import Header from "../../common/header/Header";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Home.css";

const styles = (theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    //style to display grid
    grid: {
        padding: "20px",
        "margin-left": "0.5%",
        "margin-right": "0.5%",
        transform: "translateZ(0)",
        cursor: "pointer",
    },
    //style to display grid card
    gridCard: {
        "@media (min-width: 1200px)": {
            "flex-grow": "0",
            "max-width": "25%",
            "flex-basis": "25%",
        },
        "@media (min-width: 960px) and (max-width:1200px)": {
            "flex-grow": "0",
            "max-width": "33%",
            "flex-basis": "33%",
        },
    },
    //style to display card
    card: {
        height: "500px",
        "@media (min-width: 1300px)": {
            height: "500px",
        },
        "@media (min-width: 960px) and (max-width:1300px)": {
            height: "375px",
        },
    },
    media: {
        height: "40%",
        width: "100%",
    },
    //style to display title
    title: {
        "font-size": "25px",
        "@media (min-width: 1300px)": {
            "font-size": "30px",
        },
        "@media (min-width: 960px) and (max-width:1300px)": {
            "font-size": "30px",
        },
        "@media (max-width: 960px)": {
            "font-size": "40px",
        },
    },
    //style to display categories
    categories: {
        "font-size": "16px",
        "overflow-wrap": "break-word",
        "@media (min-width: 1300px)": {
            "font-size": "15px",
            "overflow-wrap": "break-word"
        },
        "@media (min-width: 960px) and (max-width:1300px)": {
            "font-size": "20px",
            "overflow-wrap": "break-word"
        },
        "@media (max-width: 960px)": {
            "font-size": "15px",
            "overflow-wrap": "break-word"
        },
    },
     //style to display card content
    cardContent: {
        padding: "10px",
        "margin-left": "20px",
        "margin-right": "20px",
        height: "20%",
        display: "flex",
        "align-items": "center",
    },
     //style to display card Action
    cardActionArea: {
        display: "flex",
        height: "100%",
        "flex-direction": "column",
        "align-items": "normal",
        "justify-content": "space-between",
    },
});

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurantList: []
        };
    }
    /*
    get all the restaurants at the time of page load
    */
    componentDidMount() {
        let data = null;
        let xhr = new XMLHttpRequest();
        let that = this;
        xhr.addEventListener("readystatechange", function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                that.setState({
                    restaurantList: JSON.parse(this.responseText).restaurants
                });
            }
        });

        xhr.open("GET", this.props.baseUrl + "restaurant");
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send(data);
    }
    /*
    update search restaurant based on the search
    */
    updateSearchRestaurant = (searchRestaurant) => {
            this.setState({
                ...this.state,
                restaurantList: searchRestaurant
            });
    };
    /*
    navigate to restaurant details page on click of restaurant
    */
    restaurantCardClickHandler = (restaurantId) => {
        this.props.history.push("/restaurant/" + restaurantId);
    };

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Header
                    searchOptions="true"
                    baseUrl={this.props.baseUrl}
                    updateSearchRestaurant={this.updateSearchRestaurant}
                />
                <div className="flex-container">
                    <Grid
                        container
                        spacing={3}
                        wrap="wrap"
                        alignContent="center"
                        className={classes.grid}
                    >
                        {this.state.restaurantList !== null ? (
                            this.state.restaurantList.map((restaurant) => (
                                <Grid
                                    key={restaurant.id}
                                    item
                                    xs={12}
                                    sm={6}
                                    md={3}
                                    className={classes.gridCard}
                                >
                                    <Card className={classes.card}>
                                        <CardActionArea
                                            className={classes.cardActionArea}
                                            onClick={() =>
                                                this.restaurantCardClickHandler(restaurant.id)
                                            }
                                        >
                                            <CardMedia
                                                className={classes.media}
                                                image={restaurant.photo_URL}
                                                title={restaurant.restaurant_name}
                                            />
                                            <CardContent className={classes.cardContent}>
                                                <Typography
                                                    className={classes.title}
                                                    variant="h5"
                                                    component="h2"
                                                >
                                                    {restaurant.restaurant_name}
                                                </Typography>
                                            </CardContent>
                                            <CardContent className={classes.cardContent}>
                                                <Typography
                                                    variant="body2"
                                                    component="p"
                                                    className={classes.categories}
                                                >
                                                    {restaurant.categories}
                                                </Typography>
                                            </CardContent>
                                            <CardContent className={classes.cardContent}>
                                                <div className="card-bottom-info">
                          <span className="rest-rating">
                            <FontAwesomeIcon
                                icon="star"
                                size="sm"
                                color="white"
                            />
                            <Typography variant="caption" component="p">
                              {restaurant.customer_rating}
                            </Typography>
                            <Typography variant="caption" component="p">
                              ({restaurant.number_customers_rated})
                            </Typography>
                          </span>
                                                    <span className="rest-for-two">
                            <Typography
                                variant="caption"
                                component="p"
                                style={{ fontSize: "14px" }}
                            >
                              <FontAwesomeIcon icon="rupee-sign" />
                                {restaurant.average_price}
                            </Typography>
                            <Typography
                                variant="caption"
                                component="p"
                                style={{ fontSize: "14px" }}
                            >
                              for two
                            </Typography>
                          </span>
                                                </div>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Typography variant="body1" component="p">
                                No restaurant with given name.
                            </Typography>
                        )}
                    </Grid>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Home);
