// import { render, waitFor, screen } from '@testing-library/react';
// import Home from './Home';
// import { MockedProvider } from '@apollo/react-testing';
// import { Router } from 'react-router-dom';
// import { createMemoryHistory } from 'history';

// describe('Home', () => {
//   window.scrollTo = () => {};
//   describe('search input', () => {
//     it('renders an empty search input on initial render', async () => {
//       const history = createMemoryHistory();
//       render(
//         <MockedProvider mocks={[]}>
//           <Router history={history}>
//             <Home />
//           </Router>
//         </MockedProvider>
//       );

//       await waitFor(() => {
//         const searchInput = screen.getByPlaceholderText(
//           `Search 'San Fransisco'`
//         ) as HTMLInputElement;

//         expect(searchInput.value).toEqual('');
//       });
//     });
//   });

//   // describe('premium listings', () => {
//   //   it('first test!', () => {
//   //     expect(1).toEqual(1);
//   //   });
//   // });
// });
