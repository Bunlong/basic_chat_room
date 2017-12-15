import React from 'react';
import { Field, reduxForm } from 'redux-form';

let RoomForm = props => {
  const { handleSubmit, handleChange } = props;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Field 
          name="text" 
          component="input" 
          type="text" 
          onChange={(e) => {handleChange}} 
          onKeyPress={event => {
                if (event.key === 'Enter') {
                  alert("Hello");
                }
              }}
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  )
}

RoomForm = reduxForm({
  form: 'RoomForm'
})(RoomForm);

export default RoomForm;
