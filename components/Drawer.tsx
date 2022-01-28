import drawerStyles from '../styles/Drawer.module.css'

type Props = {
  children: JSX.Element
  isOpen: boolean;
  setIsOpen: Function;
}
const Drawer: React.FC<Props> = ({children, isOpen, setIsOpen}) => {
  return (
    <main className={`${drawerStyles.main} ${isOpen ? drawerStyles.active : drawerStyles.inactiveMain}`}>
      <section className={`${drawerStyles.drawer} ${isOpen ? drawerStyles.active : drawerStyles.inactive}`}>
        <article>
          <div>
            {children}
          </div>
        </article>
      </section>

      <section className={drawerStyles.outside} onClick={() => setIsOpen(false)}>
      </section>
    </main>
  );
}

export default Drawer;