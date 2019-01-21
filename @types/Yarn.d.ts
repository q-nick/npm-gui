declare namespace Yarn {
  type ResultDependency = string[];
  type ResultTreeDependency = {
    name: string,
  };

  interface ResultTree {
    type: 'tree',
    data: {
      trees: ResultTreeDependency[],
    },
  }
  interface ResultTable {
    type: 'table',
    data: {
      body: ResultDependency[],
    },
  }
  interface ResultInfo {
    type: 'info',
  }
  type Result = ResultTable | ResultInfo | ResultTree;
}
