// import React, { useContext, useState } from 'react';
// import Select from 'react-select';
// import NumberFormat from 'react-number-format';
// import { iOrder, iPayment } from 'components/interfaces';
// import OrderContext, { initPayment, OrderContextType } from 'components/context/order-context';

// export const PaymentForm = (item: iPayment): React.ReactNode => {
// //  const ctx: OrderContextType = useContext(OrderContext);
//   //const [payments, setPayments] = useState<iPayment[]>([initPayment]);
// //  const [payment, setPayment] = useState<iPayment>({ ...initPayment, orderId: ctx.order?.id || 0 })

//   // React.useEffect(() => {
//   //   let isLoaded = false;
//   //   const loadPayment = () => {
//   //     if (!isLoaded) {
//   //       setPayment(ctx.order && ctx.order.payments && ctx.order.payments || [{ ...initPayment, orderId: ctx.order?.id || 0}]);
//   //     }
//   //   };
//   //   loadPayment();
//   //   return () => { isLoaded = true; };
//   // }, [ctx.order?.payment]);

//   const deleteData = async (e: React.MouseEvent) => {
//     const baseUrl = `/api/payment/${item.id}`;

//     e.preventDefault();

//     const res = await fetch(baseUrl, {
//       method: 'DELETE',
//       headers: {
//         'Content-type': 'application/json; charset=UTF-8'
//       }
//     });

//     const data: any = await res.json();

//     if (res.status !== 200) {
//       alert(data.message);
//     } else {
//       const order = ctx.order;
//       if (order) {
//         const payments = order.payments;
//         if (payments) {
//           const delPayment: iPayment = payments.filter(x => x.id === payment.id)[0];
//           ctx.mutate && ctx.mutate({
//             ...ctx.order,
//             payment: (+order.payment) - (delPayment.amount),
//             remainPayment: (+order.remainPayment) + (delPayment.amount),
//             payments: payments.filter(x => x.id !== delPayment.id)
//           }, false)
//         }
//       }
//     }
//   }

//   const formSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const payId = payment.id;
//     const baseUrl = `/api/payment/${payId}`;

//     const res = await fetch(baseUrl, {
//       method: payId === 0 ? 'POST' : 'PUT',
//       headers: {
//         'Content-type': 'application/json; charset=UTF-8'
//       },
//       body: JSON.stringify({
//         data: payment
//       })
//     });

//     const data: iPayment | any = await res.json();

//     if (res.status !== 200) {
//       alert(data.message);
//     } else {
//       if (ctx.order && ctx.order.payments) {
//         if (payId === 0) {
//           ctx.mutate && ctx.mutate((state: iOrder) => ({
//             ...state,
//             payment: state.payment + data.amount,
//             remainPayment: state.remainPayment - data.amount,
//             payments: state.payments && [...state.payments, payment]
//           }), false)
//         } else {
//           let index = -1;
//           for (let c = 0; c < ctx.order.payments.length; c++) {
//             if (ctx.order.payments[c].id === payId) {
//               index = c;
//               break;
//             }
//           }
//           if (index !== 0) {
//             const delPayment = ctx.order.payments[index];
//             ctx.mutate && ctx.mutate((state: iOrder) => ({
//               ...state,
//               payment: (+state.payment) + (+data.amount) - (+delPayment.amount),
//               remainPayment: (+state.remainPayment) - (+data.amount) + (+delPayment.amount),
//               payments: state.payments?.splice(index, 1, data)
//             }), false)
//           }
//         }
//       }
//     }
//   };

//   return (
//     <form onSubmit={(e) => formSubmit(e)}>
//       <div className={'row'}>
//         <div className={'col-md-6 mb-2'}>
//           <div className={'row g-2'}>

//           </div>
//         </div>
//       </div>
//     </form>
//   );
// };

// const customStyles = {
//   input: () => ({ marginTop: 8, paddingTop: 12, marginLeft: 9 }),
//   valueContainer: () => ({
//     height: 46,
//     //   margin: '-10px 0px 0px 7px',
//   }),
//   singleValue: (p: any, s: any) => ({ ...p, marginTop: 6, marginLeft: 9 })
// }

export { }
