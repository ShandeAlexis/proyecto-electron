import { Link } from 'react-router-dom';
import '../styles/error404.css'

export function Error404() {

  return (
    <>
    <section className="page_404">
      <div className="container">
        <div className="row-1">
          <div className="col-sm-12">
            <div className="col-sm-10 col-sm-offset-1 text-center mx-auto">
              <div className="four_zero_four_bg">
                <h1 className="text-center">404</h1>
              </div>

              <div className="contant_box_404">
                <h3 className="h2">Parece que estás perdido</h3>

                <p>¡La página que estás buscando no está disponible!</p>

                <Link to="/login" className="link_404">
                  IR A LOGIN
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
  );
}
