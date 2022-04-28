const chai = require('chai');

import { chaiDomDiff } from '@open-wc/semantic-dom-diff';
import { chaiA11yAxe } from 'chai-a11y-axe';

chai.use(chaiDomDiff);
chai.use(chaiA11yAxe);

const { getComputedStyle } = window;
window.getComputedStyle = (
  elt: Element,
  pseudoElt?: string | null | undefined
) => getComputedStyle(elt, pseudoElt);
