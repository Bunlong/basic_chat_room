import React from 'react';
import { Field, reduxForm } from 'redux-form';

let RoomForm = props => {
  const { data, handleSubmit, handleChange } = props;
  
  return (
    <div>
      <ul> 
        {data.map(i => <li key={i}>{i}</li> )}        
      </ul>
      <form onSubmit={handleSubmit}>
        <Field 
          name="text" 
          component="input" 
          type="text"
          onKeyPress={handleChange} 
          value="Hello"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

RoomForm = reduxForm({
  form: 'RoomForm'
})(RoomForm);

export default RoomForm;
