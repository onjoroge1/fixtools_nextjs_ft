import { v4 as uuidv4 } from 'uuid';
const textTool = [
  {
    id: uuidv4(),
    image: 'images/card-icon-21.png',
    title: 'Remove Space',
    category: 'Text Tools',
    categorysty: 'dec',
    type: '',
    link: '/text-tools/remove-spaces',
    desc: 'Tool for removing spaces',
  },
  {
    id: uuidv4(),
    image: 'images/card-icon-21.png',
    title: 'Extract Email',
    category: 'Text Tools',
    categorysty: 'dec',
    type: '',
    link: '/text-tools/extract-email',
    desc: 'Tool for removing Extracting Email',
  },
  {
    id: uuidv4(),
    image: 'images/card-icon-21.png',
    title: 'Extract Link',
    category: 'Text Tools',
    categorysty: 'dec',
    type: '',
    link: '/text-tools/extract-links',
    desc: 'Tool for Extracting Link',
  },
];

export default textTool;
