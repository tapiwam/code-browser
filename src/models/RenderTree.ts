interface RenderTree {
  id: string;
  name: string;
  children?: readonly RenderTree[];
}

export default RenderTree;
