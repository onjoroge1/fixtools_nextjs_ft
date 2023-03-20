import AiTool from './AiTools';
import HtmlTool from './HtmlTool';
import JsonTool from './JsonTool';
import CssTool from './CssTool';
import conversionToolsDb from './conversionToolsDb';
import textTool from './textTools';
import seoTools from './seoTools';

const Data = [
  ...AiTool,
  ...conversionToolsDb,
  ...HtmlTool,
  ...JsonTool,
  ...CssTool,
  ...textTool,
  ...seoTools,
];
export default Data;
