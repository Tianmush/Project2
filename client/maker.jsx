const helper =require('./helper.js');
const React =require('react');
const ReactDOM =require('react-dom');



const handleTweet = (e) => {
    e.preventDefault();
    helper.hideError();
  
    const resName = e.target.querySelector('#resName').value;
    const tweetmsg = e.target.querySelector('#tweetmsg').value;
  
    if (!resName || !tweetmsg) {
      helper.handleError('Receiver username and message are required!');
      return false;
    }
  
    helper.sendPost(e.target.action, { resName, tweetmsg }, loadTweetsFromServer);
  
    return false;
  };
  
  

  const TweetForm = (props) => {
    return (
      <form
        id='tweetForm'
        name='tweetForm'
        onSubmit={handleTweet}
        action='/maker'
        method='POST'
        className='tweetForm'
      >
        {/* Existing fields */}
        <label htmlFor='resName'>To:</label>
        <input id='resName' type='text' name='resName' placeholder='Receiver Username' />

        <label htmlFor='tweetmsg'>Message:</label>
        <input id='tweetmsg' type='text' name='tweetmsg' placeholder='Type your message' />

  
        <input className='makeTweetSubmit' type='submit' value='Tweet' />
      </form>
    );
  };


  const TweetList = (props) => {
    if (props.tweets.length === 0) {
      return (
        <div className='tweetList'>
          <h3 className='emptyTweet'>No Tweets Yet!</h3>
        </div>
      );
    }
  
    const tweetNodes = props.tweets.map((tweet) => {
      const senderName = tweet.sender ? tweet.sender.username : 'Unknown Sender';
      const receiverName = tweet.receiver ? tweet.receiver.username : 'Unknown Receiver';
  
      return (
        <div key={tweet._id} className='tweet'>
          <img src='/assets/img/Twitter.png' alt='Twitter' className='tweetFace' />
          <h3 className='tweetName'>From: {senderName} | To: {receiverName}</h3>
          <p className='tweetmsg'>Message: {tweet.message}</p>
        </div>
      );
    });
  
    return (
      <div className='tweetList'>
        {tweetNodes}
      </div>
    );
  };

const loadTweetsFromServer = async()=>{
        const response =await fetch('/getTweets');
        const data = await response.json();
        ReactDOM.render(
            <TweetList tweets = {data.tweets}/>,
            document.getElementById('tweets')
        );      
}


const init =()=>{
    ReactDOM.render(
        <TweetForm/>,
        document.getElementById('makeTweet')
    );
    ReactDOM.render(
        <TweetList tweets={[]}/>,
        document.getElementById('tweets')
    );
    loadTweetsFromServer();
}
window.onload = init;
