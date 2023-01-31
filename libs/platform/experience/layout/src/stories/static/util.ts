import { html, TemplateResult } from 'lit';
import { CompositionLayout } from '../../../../src/models';

export const generateLayoutItems = (
  length = 1,
  start = 1,
  prefix = '',
  highlight = false
): TemplateResult => {
  return html`${Array.from(
    { length },
    (_, i) =>
      html`<div
        style="${highlight ? 'background:var(--oryx-color-secondary-300)' : ''}"
      >
        ${prefix}${i + start}
      </div>`
  )}`;
};

export const generateNestedLayout = (
  layout: CompositionLayout
): TemplateResult => html`
  <h1>Nested layout</h1>

  <h2>Nested grid</h2>

  <ul>
    <li>
      Nested column count is based on the parent span, so that the natural
      column size is not distorted
    </li>
    <li>
      Nested column count is driven by parent span, and defaults to 1 (1st
      column)
    </li>
    <li>Nested column count is driven by parent span (3rd column, span=2)</li>
  </ul>

  <oryx-layout layout=${layout} container>
    <oryx-layout layout="grid">
      ${generateLayoutItems(6, 1, 'N', true)}
    </oryx-layout>
    <div>2</div>
    <oryx-layout layout="grid" style="--span:2">
      ${generateLayoutItems(6, 1, 'N', true)}
    </oryx-layout>
    ${generateLayoutItems(12, 5)}
  </oryx-layout>

  <ul>
    <li>The nested items can have custom height (1)</li>
    <li>The nested layout can be aligned, e.g. centered (2)</li>
    <li>The nested layout can be aligned, e.g. stretched (3)</li>
    <li>
      The nested layout supports padding and borders without interfering with
      the column size
    </li>
  </ul>

  <oryx-layout layout=${layout} container style="align-items: center">
    <div style="height: 300px">1 (height: 300px)</div>
    <oryx-layout
      layout="grid"
      style="--span:2;align-self: center;border: solid 3px var(--oryx-color-secondary-300);padding: 10px"
    >
      ${generateLayoutItems(6, 1, 'N', true)}
    </oryx-layout>
    <div style="align-self: stretch">3</div>
    ${generateLayoutItems(12, 4)}
  </oryx-layout>

  <h2>Nested carousel</h2>

  <p>Nested carousels support the same features as a nested grid</p>

  <oryx-layout layout=${layout} container>
    <oryx-layout layout="carousel">
      ${generateLayoutItems(4, 1, 'N', true)}
    </oryx-layout>
    <div>2</div>
    <oryx-layout layout="carousel" style="--span:2">
      ${generateLayoutItems(4, 1, 'N', true)}
    </oryx-layout>
    ${generateLayoutItems(12, 5)}
  </oryx-layout>

  <p>Nested carousels support the same features as a nested grid</p>

  <oryx-layout layout=${layout} container style="align-items: center">
    <div style="height:150px">1</div>
    <oryx-layout
      layout="carousel"
      style="--span:2;align-self: center;border: solid 3px var(--oryx-color-secondary-300);padding: 10px;--scroll-start: 10px;"
    >
      ${generateLayoutItems(4, 1, 'N', true)}
    </oryx-layout>
    ${generateLayoutItems(12, 3)}
  </oryx-layout>

  <h2>Nested columns</h2>

  <p>Nested columns support the same features as a nested grid</p>

  <oryx-layout layout=${layout} container>
    <div>1</div>
    <oryx-layout layout="columns">
      ${generateLayoutItems(5, 1, 'N', true)}
    </oryx-layout>
    ${generateLayoutItems(10, 5)}
  </oryx-layout>

  <p>
    Span is taken into account when "recalculating" the nested columns (N1 - N6)
  </p>

  <oryx-layout layout=${layout} container>
    <div>1</div>
    <oryx-layout layout="columns" style="--span:2">
      ${generateLayoutItems(11, 1, 'N', true)}
    </oryx-layout>
    ${generateLayoutItems(10, 5)}
  </oryx-layout>

  <h2>Nested flex</h2>

  <p>Nested flex layout is not affected by the parent grid system</p>

  <oryx-layout layout=${layout} container>
    <div>1</div>
    <oryx-layout layout="flex">
      ${generateLayoutItems(3, 1, 'N', true)}
    </oryx-layout>
    ${generateLayoutItems(10, 5)}
  </oryx-layout>

  <p>Spanning column does not effect the nested flex layout</p>

  <oryx-layout layout=${layout} container>
    <div>1</div>
    <oryx-layout layout="flex" style="--span:2">
      <div style="background:var(--oryx-color-secondary-300)">
        N1 - lengthy content
      </div>
      ${generateLayoutItems(3, 2, 'N', true)}
    </oryx-layout>
    ${generateLayoutItems(10, 5)}
  </oryx-layout>

  <h2>Nested list</h2>

  <p>Nested list layout is not affected by the parent grid system</p>

  <oryx-layout layout=${layout} container>
    <div>1</div>
    <oryx-layout layout="list">
      ${generateLayoutItems(3, 1, 'N', true)}
    </oryx-layout>
    ${generateLayoutItems(10, 5)}
  </oryx-layout>

  <h2>Nested text inside ${layout}</h2>

  <p>Nested text layout takes the the same minimum columns as grid/carousel</p>

  <oryx-layout layout=${layout} container>
    <div>1</div>
    <oryx-layout layout="text" style="--span:2">
      <h3>Lorem ipsum</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        <mark>Laboro autem non sine causa;</mark> Nos paucis ad haec additis
        finem faciamus aliquando; Duo Reges: constructio interrete.
        <a href="http://loripsum.net/" target="_blank"
          >Quare attende, quaeso.</a
        >
        Conferam avum tuum Drusum cum C. Si longus, levis dictata sunt.
      </p>

      <p>
        Eadem nunc mea adversum te oratio est. Qui non moveatur et offensione
        turpitudinis et comprobatione honestatis? Atqui haec patefactio quasi
        rerum opertarum, cum quid quidque sit aperitur, definitio est. Est enim
        effectrix multarum et magnarum voluptatum.
        <a href="http://loripsum.net/" target="_blank">Si longus, levis.</a>
        Quid autem habent admirationis, cum prope accesseris? Piso igitur hoc
        modo, vir optimus tuique, ut scis, amantissimus.
        <i>Dicimus aliquem hilare vivere;</i>
      </p>

      <p>
        In qua si nihil est praeter rationem, sit in una virtute finis bonorum;
        Sed venio ad inconstantiae crimen, ne saepius dicas me aberrare; Hoc
        loco tenere se Triarius non potuit. Si enim ita est, vide ne facinus
        facias, cum mori suadeas. At negat Epicurus-hoc enim vestrum lumen
        estquemquam, qui honeste non vivat, iucunde posse vivere.
        <b>Contineo me ab exemplis.</b> Minime vero, inquit ille, consentit.
        Progredientibus autem aetatibus sensim tardeve potius quasi nosmet ipsos
        cognoscimus.
      </p>
    </oryx-layout>
    ${generateLayoutItems(10, 5)}
  </oryx-layout>

  <h2>Nested without layout</h2>

  <p>No layout is supported to be flexible to create any layout required</p>

  <oryx-layout layout=${layout} container>
    <div>1</div>
    <oryx-layout> ${generateLayoutItems(3, 1, 'N', true)} </oryx-layout>
    ${generateLayoutItems(10, 5)}
  </oryx-layout>
`;
