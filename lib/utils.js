export const GetCurrentPageContent = (path, dbTools) =>
  dbTools.find((tool) => tool.link === path);
