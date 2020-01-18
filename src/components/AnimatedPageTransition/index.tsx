import React from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

export interface AnimatedPageTransitionProps {
  children: JSX.Element
}

const AnimatedPageTransition = (props: AnimatedPageTransitionProps) => {
  return (
    <TransitionGroup key="1">
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
