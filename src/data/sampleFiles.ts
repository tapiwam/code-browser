const fileTree = {
  id: "root",
  name: "Parent",
  type: "folder",
  children: [
    {
      id: "1",
      name: "test.csv",
      type: "file",
    },
    {
      id: "2",
      name: "src",
      type: "folder",
      children: [
        {
          id: "3",
          name: "index.html",
          type: "file",
        },
      ],
    },
  ],
};

export default fileTree;
