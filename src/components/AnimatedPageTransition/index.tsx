import React from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

export interface AnimatedPageTransitionProps {
  children: JSX.Element
  className?: string
  top?: boolean
}

const AnimatedPageTransition = (props: AnimatedPageTransitionProps) => {
  const classNames = [props.className ? props.className : ''].join(' ')
  const transitionClassNames = props.top ? 'mask-top' : 'mask'
  return (
    <TransitionGroup key={1} className={classNames}>
      <CSSTransition
        classNames={transitionClassNames}
        appear={true}
        timeout={{
          enter: 0,
          appear: 300,
          exit: 300
        }}
      >
        {props.children}
      </CSSTransition>
    </TransitionGroup>
  )
}

export default AnimatedPageTransition
