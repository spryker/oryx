import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { layoutStaticStyles } from './styles';
import { generateLayoutItems, generateNestedLayout } from './util';

export default {
  title: `${storybookPrefix}/Layout/Static`,
};

const Template: Story = (): TemplateResult => {
  return html`
    <h1>Text layout</h1>

    <h2>5 items</h2>
    <oryx-layout layout="text"> ${generateLayoutItems(5)} </oryx-layout>

    <h2>6 items</h2>
    <oryx-layout layout="text"> ${generateLayoutItems(6)} </oryx-layout>

    <h2>7 items</h2>
    <oryx-layout layout="text"> ${generateLayoutItems(7)} </oryx-layout>

    <h2>2 cols</h2>
    <oryx-layout
      layout="text"
      .options=${{ rules: [{ padding: '50px', gap: '20px' }] }}
    >
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

    <h2>3 cols</h2>
    <oryx-layout
      layout="text"
      .options=${{ rules: [{ padding: '50px', gap: '40px', columnCount: 3 }] }}
    >
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

    ${generateNestedLayout('text')}

    <style>
      ${layoutStaticStyles} p {
        margin-top: 0;
      }
    </style>
  `;
};

export const Text = Template.bind({});
