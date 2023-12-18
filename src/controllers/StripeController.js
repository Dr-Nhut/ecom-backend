import { conn } from "../../index.js";
import 'dotenv/config';
import Stripe from "stripe";

const stripe = Stripe(process.env.STRIPE_KEY);
let endpointSecret;
endpointSecret = "whsec_b3b357db40f186682b7175a25daefa241389671e3e9747780fb4e77a84386dc8";

class StripeController {

    async index(req, res, next) {
        const products = req.body.products.map(product => ({
            idCartDetail: product.idCartDetail,
        }))
        const customer = await stripe.customers.create({
            metadata: {
                userId: req.idUser,
                cart: JSON.stringify(products),
            }
        })
        const line_items = req.body.products.map(product => ({
            price_data: {
                currency: 'vnd',
                product_data: {
                    name: product.product_name,
                    description: `${product.size} / ${product.color}`,
                    metadata: {
                        id: product.idCartDetail
                    }
                },
                unit_amount: product.product_price,
            },
            quantity: product.quantity,
        }))
        const session = await stripe.checkout.sessions.create({
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 21000,
                            currency: 'vnd',
                        },
                        display_name: 'Chuyển phát nhanh',
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 3,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 5,
                            },
                        },
                    },
                },
            ],
            customer: customer.id,
            line_items,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/checkout-success?session_id=${customer.id}`,
            cancel_url: `${process.env.CLIENT_URL}/checkouts`,
        });
        res.json({ url: session.url, id: session.customer });
    }

    //Stripe Webhook
    webhook(request, response) {
        const sig = request.headers['stripe-signature'];
        let data;
        let eventType;

        if (endpointSecret) {
            let event;
            try {
                event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);

            } catch (err) {
                response.status(400).send(`Webhook Error: ${err.message}`);
                return;
            }

            data = event.data.object;
            eventType = event.type;
        }
        else {
            data = request.body.data.object;
            eventType = request.body.type;
        }

        //Handle events
        if (eventType === "checkout.session.completed") {
            stripe.customers.retrieve(data.customer)
                .then(customer => {
                    const items = JSON.parse(customer.metadata.cart);
                    const idUser = customer.metadata.userId;
                    const totalPrice = data.amount_total;
                    const quantity = items.length;
                    const sql = "INSERT INTO orders (idUser, totalPrice, quantity, orderStatus, payment) VALUES (?, ?, ?, ?, ?);";
                    conn.promise().query(sql, [+idUser, totalPrice, quantity, 0, 1])
                        .then((response) => {
                            const idOrders = response[0].insertId;
                            items.map((item) => {
                                const sql = "INSERT INTO orders_detail (idOrder, idCartItem) VALUES (?, ?);";
                                conn.promise().query(sql, [idOrders, item.idCartDetail])
                                    .catch((error) => console.error(error));
                            })
                        })
                        .catch(err => console.error(err));
                })
                .catch(err => console.log(err.message));
        }

        response.send().end();
    }
}

export default new StripeController; 