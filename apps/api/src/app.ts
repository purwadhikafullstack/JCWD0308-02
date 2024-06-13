import { fileURLToPath } from 'url';
import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
} from 'express';
import cors from 'cors';
import path from 'path';
import { PORT } from './config.js';
import { AuthMiddleware } from './middlewares/auth.middleware.js';
import { UserRouter } from './api/user/user.router.js';
import { morganMiddleware } from './middlewares/morgan.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { AuthRouter } from './api/auth/auth.router.js';
import { CartRouter } from './api/cart/cart.router.js';
import { OrderRouter } from './api/order/order.router.js';
import { StockRouter } from './api/stock/stock.router.js';
import { AddressRouter } from './api/address/address.router.js';
import { ProductRouter } from './api/product/product.router.js';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json({ limit: '10mb' }));
    this.app.use(urlencoded({ extended: true, limit: '10mb' }));
    this.app.use(morganMiddleware);
    this.app.use(AuthMiddleware.identifyRequest);
    this.app.use(
      '/public',
      express.static(path.join(__dirname, '../../api/public')),
    );
  }

  private routes(): void {
    const userRouter = new UserRouter();
    const authRouter = new AuthRouter();
    const cartRouter = new CartRouter();
    const orderRouter = new OrderRouter();
    const stockRouter = new StockRouter();
    const addressRouter = new AddressRouter();
    const productRouter = new ProductRouter()

    this.app.get('/', (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student !`);
    });

    this.app.use('/api/users', userRouter.getRouter());

    this.app.use('/api/auth', authRouter.getRouter());

    this.app.use('/api/cart', cartRouter.getRouter());

    this.app.use('/api/order', orderRouter.getRouter());

    this.app.use('/api/stock', stockRouter.getRouter());

    this.app.use('/api/address', addressRouter.getRouter());
    this.app.use('/api/product', productRouter.getRouter());

  }
  

  private handleError(): void {
    this.app.use(errorMiddleware);
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).send('Not found !');
      } else {
        next();
      }
    });

    // error
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes('/api/')) {
          console.error('Error : ', err.stack);
          res.status(500).send('Error !');
        } else {
          next();
        }
      },
    );
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
