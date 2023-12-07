export class CategoryNavigationFragment {
  get = () => cy.get(`[uid='category-navigation']`);

  getLink = (n: number) => this.get().find('a').eq(n);
}
