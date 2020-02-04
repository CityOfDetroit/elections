import React, { useState }from 'react';
import './Message.scss';

function Message(props) {
    const {
        msg: [msg, setMsg],
    } = {
        msg: useState(0),
    ...(props.state || {})
    };

    const closeMsg = () => {
        setMsg(undefined);
    }

    const buildMsg = () => {
        let markup;
        if(msg != undefined){
            markup = <article className={msg.status}>
                <button onClick={()=>{setMsg(undefined)}}>x</button>
                <div>
                    {(msg.title != undefined) ? <h4>{msg.title}</h4> : ''}
                    <p>{msg.body}</p>
                </div>
            </article>;
        }else{
            markup = '';
        }
        
        return markup;
    }

    return (
        buildMsg()
    );
}

export default Message;

