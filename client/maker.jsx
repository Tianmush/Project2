const helper =require('./helper.js');
const React =require('react');
const ReactDOM =require('react-dom');

const handleTweet = (e) => {
    e.preventDefault();
    helper.hideError();
  
    const name = e.target.querySelector('#resName').value;
    

    const tweetmsg = e.target.querySelector('#tweetmsg').value;
  
    if (!name || !tweetmsg ) {
      helper.handleError('All fields are required');
      return false;
    }
    
    helper.sendPost(e.target.action, { name,  tweetmsg }, loadTweetsFromServer);
    
    return false;
  };
  

const TweetForm =(props) =>{
    return(
        <form id='tweetForm'
            name='tweetForm'
            onSubmit={handleTweet}
            action='/maker'
            method='POST'
            className='tweetForm'        
        >
            <label htmlFor='name'>Name:</label>
            <input id='resName' type='text' name='name' placeholder='Receiver Username' />


            <label htmlFor='name'>Tweet:</label>
            <input id='tweetmsg' type='text' name='tweetmsg' placeholder='Share your Thoughts' />
            
            <input className='makeTweetSubmit' type='submit'value='Tweet' />

        </form>
    );
};



const handleDelete = async (domoId) => {
    try {
      const response = await fetch('/deleteDomo', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domoId }),
      });
  
      const result = await response.json();
  
      if (result.success) {
        // Reload the domos after deletion
        loadTweetsFromServer();
      } else {
        console.error('Error deleting Tweet:', result.error);
      }
    } catch (err) {
      console.error('Error deleting Tweet:', err);
    }
  };
  
const TweetList= (props)=>{

    if(props.domos.length ===0){
        return (
            <div className='domoList'>
                <h3 className='emptyDomo'>No Tweets Yet!</h3>
            </div>
        );
    }
    const tweetNodes =props.domos.map(domo=>{
        return (
            <div key={domo._id} className='domo'>
                <img src='/assets/img/Twitter.png' alt='Twitter' className='domoFace' />
                <h3 className='domoName'>TO: {domo.name} </h3>
                <p className='tweetmsg'>Tweet: {domo.tweetmsg}</p>

                
                <button onClick={() => handleDelete(domo._id)}>Delete</button>
            </div>
        );
    });

    return (
        <div className='domoList'>
            {tweetNodes}
        </div>
    )

}

const loadTweetsFromServer = async()=>{
        const response =await fetch('/getDomos');
        const data = await response.json();
        ReactDOM.render(
            <TweetList domos = {data.domos}/>,
            document.getElementById('domos')
        );      
}


const init =()=>{
    ReactDOM.render(
        <TweetForm/>,
        document.getElementById('makeDomo')
    );
    ReactDOM.render(
        <TweetList domos={[]}/>,
        document.getElementById('domos')
    );
    loadTweetsFromServer();
}
window.onload = init;
