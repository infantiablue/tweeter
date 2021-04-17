class FollowConmponent extends React.Component {
	state = {
		is_followed: this.props.is_followed == "True" ? true : false,
		target_id: this.props.target_id,
		following: parseInt(this.props.following),
		followers: parseInt(this.props.followers),
	};

	handleFollow = () => {
		postData("/follow", { target_id: this.state.target_id }).then((data) => {
			if (!data.error) {
				notify(data.message);
				if (data.followed) this.setState({ followers: this.state.followers + 1 });
				else this.setState({ followers: this.state.followers - 1 });
				this.setState({ is_followed: !this.state.is_followed });
			} else {
				notify(data.error, "danger");
			}
		});
	};

	render() {
		return (
			<>
				<button onClick={this.handleFollow} className='btn btn-info'>
					{this.state.is_followed ? "Unfollow" : "Follow"}
				</button>
				<span className='ml-2'>
					<b>{this.state.following}</b> Following
				</span>
				<span className='ml-2'>
					<b>{this.state.followers}</b> {this.state.followers > 1 ? "Followers" : "Follower"}
				</span>
			</>
		);
	}
}
let followCtn = document.querySelector("#follow-container");
ReactDOM.render(
	<FollowConmponent
		is_followed={followCtn.dataset.isfollowed}
		target_id={followCtn.dataset.target}
		followers={followCtn.dataset.followers}
		following={followCtn.dataset.following}
	/>,
	followCtn
);
