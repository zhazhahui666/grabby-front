export default {
  functional: true, //表示没有状态，没有生命周期
  props: {
    name: String,
    renderFunc: Function
  },
  render: (h, ctx) => {
    return ctx.props.renderFunc(h,ctx.props.name)
  }
}