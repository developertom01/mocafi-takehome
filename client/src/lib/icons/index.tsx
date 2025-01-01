export { default as PersonIcon } from './person'
export { default as TimeIcon } from './time'

export type IconProps = React.SVGProps<SVGSVGElement> & {
    size?: number
    color?: string
}