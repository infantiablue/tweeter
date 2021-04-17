class CommentsComponent extends React.Component {
	state = {
		comments: null,
		commentsCount: 0,
		error: null,
		postId: this.props.post_id,
		showComments: false,
		wordCount: 0,
		textContent: "",
	};
	componentDidMount() {
		postData("/comments", { post_id: this.state.postId })
			.then((data) => {
				this.setState({ comments: data.comments, commentsCount: data.count });
			})
			.catch((error) => this.setState({ error }));
	}

	toggleComments = () => {
		postData("/comments", { post_id: this.state.postId })
			.then((data) => {
				if (!data.error) this.setState({ showComments: !this.state.showComments });
				else notify(data.error, "danger");
			})
			.catch((error) => this.setState({ error }));
	};

	handleChange = (event) => {
		this.setState({ wordCount: countWords(event.target.value) });
		this.setState({ textContent: event.target.value });
	};

	postComment = () => {
		postData("/comments", { post_id: this.state.postId, text: this.state.textContent }, "PUT").then((data) => {
			if (!data.error) {
				notify(data.message);
				this.setState({ commentsCount: parseInt(this.state.commentsCount) + 1 });
				this.toggleComments();
			} else notify(data.error, "danger");
		});
	};

	render() {
		const { commentsCount, error } = this.state;
		if (error) return <p className='text-danger'>{error.message}</p>;
		return (
			<>
				<span className='mr-2'>
					<span className='display-comment-btn mr-2' onClick={this.toggleComments}>
						<i className='bi bi-reply'></i>
					</span>
					{commentsCount}
				</span>
				{this.state.showComments ? (
					<>
						<textarea cols='40' rows='3' className='form-control' id='id_text' onChange={this.handleChange}></textarea>
						<div id='word-counter' className='text-muted text-right'>
							{this.state.wordCount} {this.state.wordCount > 1 ? "words" : "word"}
						</div>
						<div className='mt-2'>
							<a onClick={this.postComment} className='text-primary edit-btn mr-2'>
								Post
							</a>
							<a onClick={this.toggleComments} className='text-secondary edit-btn'>
								Cancel
							</a>
						</div>
					</>
				) : null}
			</>
		);
	}
}

let commentsCtn = document.querySelectorAll(".comments-container");
commentsCtn.forEach((elm) => {
	ReactDOM.render(<CommentsComponent post_id={elm.dataset.postid} />, elm);
});
