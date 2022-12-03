export const getCreators = (projects) => {
  const creators = projects.reduce((creatorObject, project) => {
    (creatorObject[project.creator] = creatorObject[project.creator] || []).push(project);
    return creatorObject;
  }, {});

  return Object.entries(creators).map((creator) => {
    const seller = creator[0];
    const sum = creator[1].map((item) => Number(item.goal)).reduce((prev, curr) => prev + curr, 0);
    return ({ seller, sum });
  });
};
