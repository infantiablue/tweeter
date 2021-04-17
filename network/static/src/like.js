class LikeConmponent extends React.Component {
	state = {
		post_id: this.props.post_id,
		counter: parseInt(this.props.counter),
		is_liked: this.props.is_liked == "True" ? true : false,
	};

	handleLike = () => {
		postData("/like", { post_id: this.state.post_id }).then((data) => {
			if (!data.error) {
				notify(data.message);
				if (data.liked) this.setState({ counter: this.state.counter + 1 });
				else this.setState({ counter: this.state.counter - 1 });
				this.setState({ is_liked: !this.state.is_liked });
			} else notify(data.error, "danger");
		});
	};

	render() {
		return (
			<>
				<i onClick={this.handleLike} className={`like-btn bi ${this.state.is_liked ? "bi-heart-fill" : "bi-heart"}`}></i>
				<span className='ml-2'>
					{this.state.counter} {this.state.counter > 1 ? "Likes" : "Like"}
				</span>
			</>
		);
	}
}

let likeCtn = document.querySelectorAll(".like-container");
likeCtn.forEach((elm) => {
	ReactDOM.render(<LikeConmponent post_id={elm.dataset.postid} counter={elm.dataset.counter} is_liked={elm.dataset.isliked} />, elm);
});
