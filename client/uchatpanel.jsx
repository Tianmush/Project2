const helper =require('./helper.js');
const React =require('react');
const ReactDOM =require('react-dom');
import { useState, useEffect } from 'react';


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
        action='/uchatpanel'
        method='POST'
        className='tweetForm'
      >
        {/* Existing fields */}
        <label htmlFor='resName'>To:</label>
        <input id='resName' type='text' name='resName' placeholder='Receiver Username' />

        <label htmlFor='tweetmsg'>Message:</label>
        <input id='tweetmsg' type='text' name='tweetmsg' placeholder='Type your message' />

  
        <input className='makeTweetSubmit' type='submit' value='TSend Chat' />
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
  
    // Filter tweets where the current user is the sender or receiver
    const filteredTweets = props.tweets.filter(
      (tweet) => tweet.sender._id === props.userId || tweet.receiver._id === props.userId
    );
  
    const tweetNodes = filteredTweets.map((tweet) => {
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
  
    return <div className='tweetList'>{tweetNodes}</div>;
  };
  

  const loadTweetsFromServer = async()=>{
    try {
      const response = await fetch('/getTweets');
      const data = await response.json();
      ReactDOM.render(
        <TweetList tweets={data.tweets} userId={data.userId} />,
        document.getElementById('tweets')
      );
    } catch (error) {
      console.error('Error loading tweets', error);
    }    
  };




const UserProfile = () => {
  const [userData, setUserData] = useState({ username: '', email: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/getUserData');
        const data = await response.json();

        // Update the state with the received user data
        setUserData({
          username: data.userData.username || '',
          email: data.userData.email || '',
        });
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="profile">
      <h2>My Profile</h2>
      <p>Username: {userData.username}</p>
      <p>Email: {userData.email}</p>
    </div>
  );
};


const UserList = (props) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    try {
      const response = await fetch(`/getAllUsers?search=${searchTerm}`);
      const data = await response.json();
      ReactDOM.render(<UserList users={data.users} />, document.getElementById('users'));
    } catch (error) {
      console.error('Error searching users', error);
    }
  };


  return (
    <div className='userList'>
      <input
        type='text'
        placeholder='Search Users'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {props.users.map((user) => (
        <div key={user._id} className='user'>
          <h3 className='userName'>{user.username}</h3>
         
        </div>
      ))}
    </div>
  );
};

const handleAddFriend = (e) => {
  e.preventDefault();
  helper.hideError();

  const frndName = e.target.querySelector('#frndName').value;

  if (!frndName) {
    helper.handleError('Friend username is required!');
    return false;
  }

  helper.sendPost('/addFriend', { frndName }, loadFriendsFromServer);

  return false;
};

const FriendForm = (props) => {
  return (
    <form
      id='friendForm'
      name='friendForm'
      onSubmit={handleAddFriend}
      action='/addFriend'
      method='POST'
      className='friendForm'
    >
      <label htmlFor='frndName'>Friend's Username:</label>
      <input id='frndName' type='text' name='frndName' placeholder='Friend Username' />

      <input className='addFriendSubmit' type='submit' value='Add Friend' />
    </form>
  );
};


const FriendList = (props) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    try {
      const response = await fetch(`/getFriends?search=${searchTerm}`);
      const data = await response.json();
      ReactDOM.render(<FriendList users={data.users} />, document.getElementById('users'));
    } catch (error) {
      console.error('Error searching friends', error);
    }
  };


  return (
    <div className='friendList'>
      <input
        type='text'
        placeholder='Search friends'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {props.users.map((user) => (
        <div key={user._id} className='user'>
          <h3 className='userName'>{friend.friend}</h3>
         
        </div>
      ))}
    </div>
  );
};

  

const loadUsersFromServer = async () => {
  try {
    const response = await fetch('/getAllUsers');
    const data = await response.json();
    ReactDOM.render(
      <UserList users={data.users} />,
      document.getElementById('users')
    );
  } catch (error) {
    console.error('Error loading users', error);
  }
};
const loadFriendsFromServer = async () => {
  try {
    const response = await fetch('/getFriends');
    const data = await response.json();

    // Filter friends based on the current user ID
    const currentUserFriends = data.friends.filter(
      (friend) => friend.user._id === data.userId
    );

    ReactDOM.render(
      <FriendList friends={currentUserFriends} userId={data.userId} />,
      document.getElementById('friends')
    );
  } catch (error) {
    console.error('Error loading Contacts', error);
  }
};

const init = () => {
    ReactDOM.render(
      <TweetForm />,
      document.getElementById('makeTweet')
    );
    ReactDOM.render(
      <TweetList tweets={[]} />,
      document.getElementById('tweets')
    );
    ReactDOM.render(
      <UserProfile />,
      document.getElementById('profile')
    ); // Render the UserProfile component
    ReactDOM.render(
      <UserList users={[]} />,
      document.getElementById('users')
    ); // Render the UserList component

    // Render FriendForm
    ReactDOM.render(
      <FriendForm />,
      document.getElementById('makeFriend')
    );

    ReactDOM.render(
      <FriendList friends={[]} />,
      document.getElementById('friends')
    );

  loadTweetsFromServer();
  loadUsersFromServer();
  loadFriendsFromServer();
};

window.onload = init;

