const helper =require('./helper.js');
const React =require('react');
const ReactDOM =require('react-dom');

const handleDomo = (e) => {
    e.preventDefault();
    helper.hideError();
  
    const name = e.target.querySelector('#domoName').value;
    
    const message = e.target.querySelector('#domoMessage').value;
  
    if (!name || !message ) {
      helper.handleError('All fields are required');
      return false;
    }
    
    helper.sendPost(e.target.action, { name,  message }, loadDomosFromServer);
    
    return false;
  };
  

const DomoForm =(props) =>{
    return(
        <form id='domoForm'
            name='domoForm'
            onSubmit={handleDomo}
            action='/maker'
            method='POST'
            className='domoForm'        
        >
            <label htmlFor='name'>Name:</label>
            <input id='domoName' type='text' name='name' placeholder='Receiver Username' />

            <pre>
            <label htmlFor='message'>Message:</label>
            <textarea id='domoMessage' name='message' placeholder='Your Message'></textarea>

            </pre>
            <input className='makeDomoSubmit' type='submit'value='Tweet' />

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
        loadDomosFromServer();
      } else {
        console.error('Error deleting Domo:', result.error);
      }
    } catch (err) {
      console.error('Error deleting Domo:', err);
    }
  };
  
const DomoList= (props)=>{

    if(props.domos.length ===0){
        return (
            <div className='domoList'>
                <h3 className='emptyDomo'>No Tweets Yet!</h3>
            </div>
        );
    }
    const domoNodes =props.domos.map(domo=>{
        return (
            <div key={domo._id} className='domo'>
                <img src='/assets/img/Twitter.png' alt='Twitter' className='domoFace' />
                <h3 className='domoName'>TO: {domo.name} </h3>
                <p className='domoMessage'>Message: {domo.message}</p>

                
                <button onClick={() => handleDelete(domo._id)}>Delete</button>
            </div>
        );
    });

    return (
        <div className='domoList'>
            {domoNodes}
        </div>
    )

}
const loadDomosFromServer = async()=>{
        const response =await fetch('/getDomos');
        const data = await response.json();
        ReactDOM.render(
            <DomoList domos = {data.domos}/>,
            document.getElementById('domos')
        );      
}


const init =()=>{
    ReactDOM.render(
        <DomoForm/>,
        document.getElementById('makeDomo')
    );
    ReactDOM.render(
        <DomoList domos={[]}/>,
        document.getElementById('domos')
    );
    loadDomosFromServer();
}
window.onload = init;
