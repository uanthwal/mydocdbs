import React, { Component, PropTypes } from 'react';
import Dimensions from 'Dimensions';
import {
	StyleSheet,
	TouchableOpacity,
	Text,
	Animated,
	Easing,
	Image,
	Alert,
	View,

} from 'react-native';
// import { Actions, ActionConst } from 'react-native-router-flux';
import { NavigationActions } from 'react-navigation'
import spinner from '../../Images/loading.gif';
import { appThemeColor } from '../../AppGlobalConfig';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const MARGIN = 40;

export default class SignupSection extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
		};

		this.buttonAnimated = new Animated.Value(0);
		this.growAnimated = new Animated.Value(0);
		this._onPress = this._onPress.bind(this);
	}

	_onPress() {

		if (this.state.isLoading) return;

		this.setState({ isLoading: true });
		Animated.timing(
			this.buttonAnimated,
			{
				toValue: 1,
				duration: 200,
				easing: Easing.linear
			}
		).start();

		setTimeout(() => {
			this._onGrow();
		}, 2000);

		setTimeout(() => {
			this.props.navigation.navigate('signupScreen');
			// Actions.signUp();
			this.setState({ isLoading: false });
			this.buttonAnimated.setValue(0);
			this.growAnimated.setValue(0);
		}, 2300);
	}

	_onGrow() {
		Animated.timing(
			this.growAnimated,
			{
				toValue: 1,
				duration: 200,
				easing: Easing.linear
			}
		).start();
	}

	render() {
		// const {navigate} = this.props.navigation;
		const changeWidth = this.buttonAnimated.interpolate({
	    inputRange: [0, 1],
	    outputRange: [DEVICE_WIDTH - MARGIN, MARGIN]
	  });
	  const changeScale = this.growAnimated.interpolate({
	    inputRange: [0, 1],
	    outputRange: [1, MARGIN]
	  });

		return (
			<View style={styles.container}>

				<Animated.View style={{width: changeWidth}}>
				<TouchableOpacity style={styles.button}
					onPress={this._onPress}
					activeOpacity={1} >
						{this.state.isLoading ?
							<Image source={spinner} style={styles.image} />
							:
							<Text style={styles.text}>Create account</Text>
						}
				</TouchableOpacity>
				<Animated.View style={[ this.state.isLoading ? styles.circle :'', {transform: [{scale: changeScale}]} ]} />
			</Animated.View>
			<Animated.View style={{width: changeWidth}}>
					<TouchableOpacity style={styles.button}
						onPress={this._onPress}
						activeOpacity={1} >
							{this.state.isLoading ?
								<Image source={spinner} style={styles.image} />
								:
								<Text style={styles.text}>Forgot Password?</Text>
							}
					</TouchableOpacity>
					<Animated.View style={[ this.state.isLoading ? styles.circle :'', {transform: [{scale: changeScale}]} ]} />
				</Animated.View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		top: 20,
		width: DEVICE_WIDTH,
		flexDirection: 'row',
		justifyContent: 'space-around',
		zIndex:99999,
	},
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		height: 40,
		zIndex: 100,
	},
	circle: {
		height: MARGIN,
		width: MARGIN,
		marginTop: -MARGIN,
		borderWidth: 1,
		borderColor:  appThemeColor.color,
		borderRadius: 100,
		alignSelf: 'center',
		zIndex: 99,
		backgroundColor:  appThemeColor.color,
	},
	text: {
		color: appThemeColor.textColorTheme,
		backgroundColor: 'transparent',
	},
	image: {
		width: 24,
		height: 24,
	},
});
