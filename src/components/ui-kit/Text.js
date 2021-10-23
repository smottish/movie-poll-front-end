import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getTextColorClass } from './utils';

export function Text({ size, color, weight, transform, className, children, ...props }) {
  const classes = classNames(
    `text-${size}`,
    getTextColorClass(color),
    `font-${weight}`,
    transform,
    className,
  )
  return (
    <span className={classes} {...props}>
      { children }
    </span>
  )
}

Text.propTypes = {
  size: PropTypes.oneOf([
    'xs',
    'sm',
    'base',
    'lg',
    'xl',
    '2xl',
    '3xl',
    '4xl',
    '5xl',
  ]),
  color: PropTypes.string,
  weight: PropTypes.oneOf([
    'thin',
    'extralight',
    'light',
    'normal',
    'medium',
    'semibold',
    'bold',
    'extrabold',
    'black',
  ]),
  transform: PropTypes.oneOf([
    'uppercase',
    'lowercase',
    'capitalize',
    'normal-case',
  ]),
}

Text.defaultProps = {
  size: 'base',
  color: '',
  weight: 'normal',
  transform: 'normal-case',
}