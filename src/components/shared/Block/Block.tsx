// function BlockContent({ category }: { category: blockType }) {
//   switch (category) {
//     // objavlenie
//     case "declaring_variable":
//       const [declarate, setDeclarate] = useState<string>("");
//       return (
//         <div className={styles.content} key={category}>
//           <input
//             onChange={(e) => setDeclarate(e.target.value)}
//             value={declarate}
//             type="text"
//             placeholder="a,b,c"
//           />
//         </div>
//       );
//     // prisvoenie
//     case "assignment":
//       const [value1, setValue1] = useState<string>("");
//       const [value2, setValue2] = useState<string>("");
//       return (
//         <div className={styles.content} key={category}>
//           <input
//             onChange={(e) => setValue1(e.target.value)}
//             value={value1}
//             className={styles.assigmentInput}
//             type="text"
//             placeholder="a"
//           />
//           <p>=</p>
//           <input
//             onChange={(e) => setValue2(e.target.value)}
//             value={value2}
//             className={styles.assigmentInput}
//             type="text"
//             placeholder="10"
//           />
//         </div>
//       );
//     // plus minus i td
//     case "expression":
//       const [value, setValue] = useState<string>("");
//       return (
//         <div className={styles.content} key={category}>
//           <input
//             onChange={(e) => setValue(e.target.value)}
//             value={value}
//             type="text"
//             placeholder="a+b-12*(23-a*a)"
//           />
//         </div>
//       );
//     case "condition":
//       const [leftCond, setLeftCond] = useState<string>("");
//       const [rightCond, setRightCond] = useState<string>("");
//       const [operator, setOperator] = useState<string>("=");
//       return (
//         <div className={styles.content} key={category}>
//           <input
//             value={leftCond}
//             onChange={(e) => setLeftCond(e.target.value)}
//             className={styles.conditionInput}
//             type="text"
//           />
//           <select
//             onChange={(e) => setOperator(e.target.value)}
//             value={operator}
//           >
//             <option value={"<="}>&lt;=</option>
//             <option value={"=="}>= =</option>
//             <option value={">="}>&gt;=</option>
//             <option value={"<"}>&lt;</option>
//             <option value={">"}>&gt;</option>
//           </select>
//           <input
//             value={rightCond}
//             onChange={(e) => setRightCond(e.target.value)}
//             className={styles.conditionInput}
//             type="text"
//           />
//         </div>
//       );
//     case "print":
//       const [print, setPrint] = useState<string>("");
//       return (
//         <div className={styles.content} key={category}>
//           <input
//             onChange={(e) => setPrint(e.target.value)}
//             value={print}
//             type="text"
//             placeholder="a,b,c"
//           />
//         </div>
//       );
//     default:
//       return <div className={styles.content}>недоступно</div>;
//   }
// }
