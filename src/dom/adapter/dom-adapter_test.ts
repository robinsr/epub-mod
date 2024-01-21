import {
  assertEquals, assertExists,
  assertStrictEquals,
  assertThrows,
} from 'https://deno.land/std@0.204.0/assert/mod.ts';


import DenoDomAdapter from '~/dom/adapter/dom-adapter.ts';

const oneLiner = (str: string) =>
  str.replaceAll(/>[^<]*</g, '><');

const body = oneLiner(`<body>
  <h1>Hello from Deno</h1>
  <form id="test-form" class="foo" hidden="hidden" width="123">
    <input type="text" name="user" class="bar">
    <button>
      Submit
    </button>
  </form>
  <p class="p-text">
    This is <em>SOME</em> text with <u>inline formatting elements</u>.
    <br>
    <br>
    And some newlines...
  </p>
</body>`);



const html = oneLiner(`<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Hello from Deno</title>
  </head>
  ${body}
</html>`);


class TestAdapter {
  getContents() {
    return html
  }

  saveContents(c: string) {}

  diffWith(u: string){}

  get target() {
    return ''
  }
}


Deno.test('dom-adapter', async (t) => {

  await t.step('it creates some DOM', () => {
    const adapter = new TestAdapter()
    const dom  = new DenoDomAdapter(adapter);

    assertEquals(dom.body, body)

    let form = dom.first('#test-form');

    assertExists(form, 'Did not find <form id="test-form">');

    assertEquals(form.tag, 'form');
    assertEquals(form.hasAttr('hidden'), true);
    assertEquals(form.getAttr('hidden'), 'hidden');
    assertEquals(form.getAttr('width'), '123');

    form.setAttr('width', '789');
    assertEquals(form.getAttr('width'), '789');

    form.removeAttr('width');
    assertEquals(form.getAttr('width'), null);

    assertEquals(form.hasClass('foo'), true);
    assertEquals(form.hasClass('qux'), false);

    form.addClass('deno-test');
    assertEquals(form.hasClass('deno-test'), true);
    assertEquals(form.classList, [ 'foo', 'deno-test' ]);
    form.removeClass('deno-test');
    assertEquals(form.hasClass('deno-test'), false);
    assertEquals(form.classList, [ 'foo' ]);


    assertEquals(form.isConnected, true);

    let cloned = form.clone();
    cloned.setAttr('id', 'cloned-form')
    form.replace(cloned);

    assertExists(dom.first('#cloned-form'));

    let formElements = form?.children;

    assertExists(formElements, 'No children of form returned');

    console.log(form.attrs)


  })
})