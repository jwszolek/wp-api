/**
 * Created by kubaw on 20/03/17.
 */

var mysql = require('mysql'),
    express = require('express');

var routes = function () {

    var investmentsRouter = express.Router();

    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'user',
        password : 'passwd',
        database : 'testingdb',
        port: '3306'
    });


    /**
     * @api {get} / Request All investments
     * @apiName GetInvestments
     * @apiGroup Investments
     *
     *
     * @apiSuccess {String} name Name of the Investment.
     * @apiSuccess {String} investment_id Investment unique ID.
     */
    investmentsRouter.route("/")
        .get(function (req, res) {
            connection.query('SELECT t.name, t.term_id as \'investment_id\' FROM ew7xh_posts pst, ew7xh_terms t, ew7xh_term_taxonomy tt, ew7xh_term_relationships tr where post_type like \'oferta\' ' +
                'and t.term_id=tt.term_id AND tt.term_taxonomy_id=tr.term_taxonomy_id and tr.object_id=pst.id and t.name <> \'Polski\' group by t.term_id;', function (err, rows, fields) {
                if (err) {
                    throw err;
                }
                if (!err) {
                    res.json(rows);
                }
                else
                    console.log('Error while performing Query.');
            });
        })

    /**
     * @api {get} /:investment_id Request List of investment offers assigned
     * @apiName GetInvestmentOffers
     * @apiGroup Investments
     *
     * @apiParam {Number} id Investment unique ID.
     *
     * @apiSuccess {Number} post_id Offer unique ID.
     * @apiSuccess {String} offer_name Offer name.
     */
    investmentsRouter.route("/:investmentId")
        .get(function (req, res) {
            connection.query('SELECT pst.id as \'post_id\', pst.post_title as \'offer_name\' FROM ew7xh_posts pst, ew7xh_terms t, ew7xh_term_taxonomy tt, ew7xh_term_relationships tr ' +
                              'where pst.post_type like \'oferta\' and t.term_id=tt.term_id AND tt.term_taxonomy_id=tr.term_taxonomy_id and tr.object_id=pst.id and t.name <> \'Polski\' ' +
                              'and t.term_id = ' +  req.params.investmentId +';', function (err, rows, fields) {
                if (err) {
                    throw err;
                }
                if (!err) {
                    res.json(rows);
                }
                else
                    console.log('Error while performing Query.');
            });
        })

    return investmentsRouter;
}

module.exports = routes;