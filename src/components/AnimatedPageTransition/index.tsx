import React from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

export interface AnimatedPageTransitionProps {
  children: JSX.Element
  className?: string
}

const AnimatedPageTransition = (props: AnimatedPageTransitionProps) => {
  const classNames = [props.className ? props.className : ''].join(' ')
  return (
    <TransitionGroup key="1" className={classNames}>
      <CSSTransition
        classNames="mask"
        appear={true}
        timeout={{
          enter: 0,
          exit: 300
        }}
      >
        {props.children}
      </CSSTransition>
    </TransitionGroup>
  )
}

export default AnimatedPageTransition
