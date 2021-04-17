class EditConmponent extends React.Component {
	state = {
		post_id: this.props.post_id,
		textContent: this.props.textContent.trim(),
		showTextarea: false,
		wordCount: countWords(this.props.textContent),
	};

	handleChange = (event) => {
		this.setState({ wordCount: countWords(event.target.value) });
		this.setState({ textContent: event.target.value });
	};

	handleEdit = () => {
		postData("/edit", { post_id: this.state.post_id, text: this.state.textContent }).then((data) => {
			if (!data.error) {
				notify(data.message);
				document.querySelector(`#text-${this.state.post_id}`).innerHTML = this.state.textContent;
				this.toggleEdit();
			} else notify(data.error, "danger");
		});
	};

	handleDelete = () => {
		if (confirm("Are you sure to delete ?")) {
			postData("/delete", { post_id: this.state.post_id }).then((data) => {
				if (!data.error) {
					let postElm = document.querySelector(`#post-${this.state.post_id}`);
					postElm.classList.add("animate__animated", "animate__fadeOut");
					postElm.addEventListener("animationend", () => postElm.remove());
				} else notify(data.error, "danger");
			});
		}
	};

	toggleEdit = () => {
		this.setState({ showTextarea: !this.state.showTextarea }, () => {
			document.querySelector(`#text-${this.state.post_id}`).style.display = !this.state.showTextarea ? "block" : "none";
		});
	};

	render() {
		return (
			<>
				{!this.state.showTextarea ? (
					<>
						<a onClick={this.toggleEdit} className='text-info edit-btn mr-2'>
							Edit
						</a>
						<a onClick={this.handleDelete} className='text-danger edit-btn'>
							Delete
						</a>
					</>
				) : null}
				{this.state.showTextarea ? (
					<>
						<textarea cols='40' rows='3' className='form-control' id='id_text' value={this.state.textContent} onChange={this.handleChange}></textarea>
						<div id='word-counter' className='text-muted text-right'>
							{this.state.wordCount} {this.state.wordCount > 1 ? "words" : "word"}
						</div>
						<div className='mt-2'>
							<a onClick={this.handleEdit} className='text-primary edit-btn mr-2'>
								Save
							</a>
							<a onClick={this.toggleEdit} className='text-secondary edit-btn'>
								Cancel
							</a>
						</div>
					</>
				) : null}
			</>
		);
	}
}
let editCtn = document.querySelectorAll(".edit-container");
editCtn.forEach((elm) => {
	let textContent = document.querySelector(`#text-${elm.dataset.postid}`).textContent;
	ReactDOM.render(<EditConmponent post_id={elm.dataset.postid} textContent={textContent} />, elm);
});
