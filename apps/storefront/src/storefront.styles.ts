import { css } from 'lit';

export const styles = css`
  nav {
    display: flex;
    background: #1ebea0;
    list-style-type: none;
    align-items: center;
  }

  nav a {
    color: white;
    text-decoration: none;
  }

  nav a:hover {
    color: #eb553c;
  }

  nav .products {
    display: flex;
    justify-content: right;
    flex: 1;
    font-size: 0.8em;
  }

  nav div,
  .products a {
    padding: 0 10px;
  }
`;
