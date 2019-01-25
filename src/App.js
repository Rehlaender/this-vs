import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { withFirebase } from './components/Firebase';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      answers: [],
      loading: false
    }
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.questions().on('value', snapshot => {
      const questionObject = snapshot.val();
      console.log(questionObject, 'object')
      const questionList = Object.keys(questionObject).map(key => ({
        ...questionObject[key],
        uuid: key,
      }));

      this.setState({
        questions: questionList,
        loading: false,
      });
    });
  }
  render() {
    const { questions, loading } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h3>question of the day:</h3>
          {loading && <h4>loading...</h4>}
          {!loading && questions && questions.map((question, key) => questionOfTheDay(question, key))}
        </header>
      </div>
    );
  }
}

const questionOfTheDay = (props, key) => {
  const { question, uuid } = props;
  return (
    <div key={key}>
      {dateOfQuestion(uuid)}
      <p>{question}</p>
      {answerSection(uuid)}
    </div>

  )
}

const answerSection = (uuid) => {
  const answerInput = React.createRef();
  const authorInput = React.createRef();

  const handleSubmit = (event) => {
    console.log(answerInput.current.value, authorInput.current.value, 'answer');
    const response = {
      answer: answerInput,
      author: authorInput,
      date: uuid
    }
    console.log(response, 'jaj');
  }

  return (
    <div>
      <input name="answer" placeholder="answer" ref={answerInput} />
      <input name="author" placeholder="author" ref={authorInput} />
      <button onClick={handleSubmit}>submit</button>
    </div>
  )
}

const dateOfQuestion = (uuid) => {
  const transformNumberIntoDate = (date) => {
    return date.replace(
      /(\d\d)(\d\d)\d\d(\d\d)/, '$1/$2/$3'
    );
  }

  return (
    <p>date: {transformNumberIntoDate(uuid)}</p>
  )
}

export default withFirebase(App);
