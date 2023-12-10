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
  
  const SelectedFriendHeader = ({ username }) => {
    return (
      <div className="selectedFriendHeader">
        <h3>Selected Friend: {username}</h3>
      </div>
    );
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

  
        <input className='makeTweetSubmit' type='submit' value='Send Chat' />
      </form>
    );
  };


  const TweetList = (props) => {
    const { tweets, userId, selectedFriendId, selectedFriendUsername } = props;
  
    if (tweets.length === 0) {
      return (
        <div className='tweetList'>
          <h3 className='emptyTweet'>No Chats Yet!</h3>
        </div>
      );
    }
  
    // If a friend is selected, filter tweets based on the selected friend's ID
    const filteredTweets = selectedFriendId
      ? tweets.filter(
          (tweet) =>
            (tweet.sender._id === userId && tweet.receiver._id === selectedFriendId) ||
            (tweet.sender._id === selectedFriendId && tweet.receiver._id === userId)
        )
      : tweets;
  
    const tweetNodes = filteredTweets.map((tweet) => {
      const senderName = tweet.sender ? tweet.sender.username : 'Unknown Sender';
      const receiverName = tweet.receiver ? tweet.receiver.username : 'Unknown Receiver';
  
      return (
        <div key={tweet._id} className='tweet'>
          
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
  

  const loadTweetsFromServer = async () => {
    try {
      const response = await fetch('/getTweets');
      const data = await response.json();
  
      // Retrieve the selected friend ID and username from localStorage
      const selectedFriendId = localStorage.getItem('selectedFriendId');
      const selectedFriendUsername = localStorage.getItem('selectedFriendUsername');
  
      // Render the tweets, passing the selected friend ID and username if available
      ReactDOM.render(
        <TweetList
          tweets={data.tweets}
          userId={data.userId}
          selectedFriendId={selectedFriendId}
          selectedFriendUsername={selectedFriendUsername}
        />,
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



const handleSelectFriend = async (friendId) => {
  try {
    // Make a request to load tweets for the selected friend
    const response = await fetch(`/getTweetsForFriend/${friendId}`);
    const data = await response.json();

    // Store the selected friend ID and username in localStorage
    localStorage.setItem('selectedFriendId', friendId);
    localStorage.setItem('selectedFriendUsername', data.selectedFriendUsername);

    // Render the tweets for the selected friend
    ReactDOM.render(
      <TweetList
        tweets={data.tweets}
        userId={data.userId}
        selectedFriendId={friendId}
        selectedFriendUsername={data.selectedFriendUsername}
      />,
      document.getElementById('tweets')
    );
  } catch (error) {
    console.error('Error loading tweets for selected friend', error);
  }
};
const handleDeleteFriend = async (friendId) => {
  try {
    const response = await fetch(`/deleteFriend/${friendId}`, { method: 'DELETE' });
    const data = await response.json();
    console.log(data.message); // Log or handle the success message as needed
    loadFriendsFromServer(); // Reload friends after deletion
  } catch (error) {
    console.error('Error deleting friend', error);
  }
};
const FriendList = (props) => {
  if (props.friends.length === 0) {
    return (
      <div className='friendList'>
        <h3 className='emptyFriend'>No Friends Yet!</h3>
      </div>
    );
  }

  const friendNodes = props.friends.map((friend) => (
    <div key={friend._id} className='friend'>
      <h3 className='friendName'>{friend.friend.username}</h3>
      <button onClick={() => handleSelectFriend(friend.friend._id)}>Select</button>
      <button onClick={() => handleDeleteFriend(friend.friend._id)}>Delete</button>
    </div>
  ));

  return <div className='friendList'>{friendNodes}</div>;
};
const loadFriendsFromServer = async () => {
  try {
    const response = await fetch('/getFriends');
    const data = await response.json();
    
    ReactDOM.render(
      <FriendList friends={data.friends} />,
      document.getElementById('friends')
    );
  } catch (error) {
    console.error('Error loading Friends', error);
  }
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
      <FriendList friends={[]} />, // Initialize with an empty array
      document.getElementById('friends')
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

