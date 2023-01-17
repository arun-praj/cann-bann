const Backdrop = ({ children, show, onClose, ...rest }) => {
   return <div {...rest}>{children}</div>
}

export default Backdrop
