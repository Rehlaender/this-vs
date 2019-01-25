import React, { Component } from 'react';
import './App.css';
import { getToday, getTodayAsUUIDString } from './utils';

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
          {newQuestion()}
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

const newQuestion = () => {
  const today = getToday();
  const newQuestionInput = React.createRef();

  const handleSubmit = () => {
    const response = {
      date: getTodayAsUUIDString(),
      question: newQuestionInput.current.value
    }

    // submitQuestion(response);
  }
  return (
    <div>
      <p>what is the question of today: {today} </p>
      <input
        name="newQuestion"
        placeholder="newQuestion"
        ref={newQuestionInput} />
      <button onClick={handleSubmit}>ask</button>
    </div>
  )
}

const answerSection = (uuid) => {
  const answerInput = React.createRef();
  const authorInput = React.createRef();

  const handleSubmit = () => {
    const response = {
      answer: answerInput.current.value,
      author: authorInput.current.value,
      date: uuid
    }

    // submitAnswer(response);
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
