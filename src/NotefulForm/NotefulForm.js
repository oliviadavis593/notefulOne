import React from 'react'
import './NotefulForm.css'

export default function NotefulForm(props) {
  const { className, ...otherProps } = props
  return (
    <form
      className={['Noteful-form', className].join(' ')}
      action='#'
      {...otherProps}
    />
  )
}

/* ======= Building the static app (#8) ======= */
//In progress.....
//NotefulForm.js ===> App.js
