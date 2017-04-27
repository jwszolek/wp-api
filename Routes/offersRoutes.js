/**
 * Created by jwszol on 10/04/17.
 */

var mysql = require('mysql'),
    express = require('express');

var async = require('asyncawait/async');
var await = require('asyncawait/await');


var routes = function () {

    var offersRouter = express.Router();

    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'user',
        password: 'passwd',
        database: 'testing',
        port: '3306',
        multipleStatements: true
    });

    /**
     * @api {get} /:offerId Request Offer information
     * @apiName GetOffer
     * @apiGroup Offers
     *
     * @apiParam {Number} id Post unique ID.
     *
     * @apiSuccess {String} firstname Firstname of the User.
     * @apiSuccess {String} lastname  Lastname of the User.
     */
    offersRouter.route("/:offerId")
        .get(function (req, res) {
            var sql = 'select * from ew7xh_postmeta where meta_key not regexp \'^_\' and post_id = ?';
            var inserts = [req.params.offerId];
            sql = mysql.format(sql, inserts);

            connection.query(sql, function (err, rows, fields) {
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

    //status danej oferty na podstawie postID - pokaz/rezerwacja/sprzedane
    // 0 - pokaz
    // 1 - rezerwacja
    // 2 - sprzedane
    /**
     * @api {get} /:offerId Request Offer status
     * @apiName GetOfferStatus
     * @apiGroup Offers
     *
     * @apiParam {Number} id Post unique ID.
     *
     * @apiSuccess {Number} status 1-rezerwacja,2-sprzedane,0-wystawione.
     */
    offersRouter.route("/status/:offerId")
        .get(function (req, res) {
            var sql = 'select * from ew7xh_postmeta where meta_key not regexp \'^_\' and post_id = ?';
            var inserts = [req.params.offerId];
            sql = mysql.format(sql, inserts);

            connection.query(sql, function (err, rows, fields) {
                if (err) {
                    throw err;
                }
                if (!err) {
                    outputJSON = JSON.stringify(rows);
                    outputJSON = JSON.parse(outputJSON);
                    var booked = false;
                    var pdf = false;

                    var arrFound = outputJSON.filter(function(item) {
                        return item.meta_key == 'czy_zarezerwowane';
                    });

                    if(typeof arrFound[0] !== 'undefined') {
                        if(arrFound[0].meta_value.includes('tak')) {
                            booked = true;
                        }else{
                            booked = false;
                        }
                        console.log(arrFound[0].meta_value);
                    }

                    console.log(booked);

                    var pdfFound = outputJSON.filter(function(item) {
                        return item.meta_key == 'pdf';
                    });

                    if(typeof pdfFound[0] !== 'undefined') {
                        pdf = pdfFound[0].meta_value;
                        console.log(pdfFound[0].meta_value);
                    }

                    if(booked){
                        res.json('1');
                    }

                    if(!booked && !pdf){
                        res.json('2');
                    }

                    if(!booked && pdf){
                        res.json('0');
                    }

                }
                else
                    console.log('Error while performing Query.');
            });
        })


    /**
     * @api {put} /:offerId Request Offer remove
     * @apiName RemoveOffer
     * @apiGroup Offers
     *
     * @apiParam {Number} id Post unique ID.
     *
     * @apiSuccess {Number} status 200.
     */
    offersRouter.route("/remove/:offerId")
        .put(function (req, res) {

        })


    offersRouter.route("/create-test/:investmentId")
        .post(function (req, res) {

            var inserted;
            insertPost(req)
                .then(function(results){
                    inserted = results.insertId;
                    console.log('lapiemy zmienna = ' + inserted);

                })
                .catch(function(e){
                    console.log(e);
                });

        })



    /**
     * @api {post} /create/:investmentId Request Offer create
     * @apiName CreateOffer
     * @apiGroup Offers
     *
     * @apiParam {String} name Offer name.
     * @apiParam {String} title Offer title.
     * @apiParam {Number} nr_lokalu Numer lokalu.
     * @apiParam {String} miasto Miasto.
     * @apiParam {Number} powierzchnia_lokalu Powierzchnia lokalu.
     * @apiParam {Number} liczba_pokoi Liczba pokoi.
     * @apiParam {Number} pietro Pietro.
     * @apiParam {String} termin_oddania Termin oddania.
     * @apiParam {Number} powierzchnia_ogrodka Powierzchnia ogrodka.
     * @apiParam {Number} cena_brutto_m2 Cena brutto za metr.
     * @apiParam {Number} cena_brutto Cena brutto.
     * @apiParam {String} naglowek_mieszkania Naglowek w opisie mieszkania.
     * @apiParam {String} opis_mieszkania Opis mieszkania.
     * @apiParam {String} czy_zarezerwowane Dwie wartosci - tak/nie.
     *
     * @apiParamExample {json} Request-Example:
     * {
     * 	"title":"testowy tytul3",
     * 	"name":"tetowa nazwa2",
     * 	"nr_lokalu": "2222",
     *  "miasto": "gdansk",
     *  "powierzchnia_lokalu":155,
     *  "liczba_pokoi": 4,
     *  "pietro":2,
     *  "termin_oddania": "2017-07-10",
     *  "powierzchnia_ogrodka": 110.0,
     *  "cena_brutto_m2" : 1000,
     *  "cena_brutto" : 155000,
     *  "balkon" : "tak",
     *  "naglowek_mieszkania": "testowy naglowek",
     *  "opis_mieszkania": "testowy opis mieszkania",
     *  "czy_zarezerwowane": "tak"
     * }
     *
     * @apiSuccess {Number} status 200.
     *
     */
    offersRouter.route("/create/:investmentId")
        .post(function (req, res) {

            var investmentId = [req.params.investmentId];

            if( typeof req.body.name === 'undefined' || typeof req.body.title === 'undefined' ||
                typeof req.body.nr_lokalu === 'undefined' || typeof req.body.miasto === 'undefined' ||
                typeof req.body.powierzchnia_lokalu === 'undefined' || typeof req.body.liczba_pokoi === 'undefined' ||
                typeof req.body.pietro === 'undefined' || typeof req.body.termin_oddania === 'undefined' ||
                typeof req.body.powierzchnia_ogrodka === 'undefined' || typeof req.body.cena_brutto_m2 === 'undefined' ||
                typeof req.body.cena_brutto === 'undefined' || typeof req.body.balkon === 'undefined' ||
                typeof req.body.naglowek_mieszkania === 'undefined' || typeof req.body.opis_mieszkania === 'undefined' ||
                typeof req.body.dodatkowe_zdjecia === 'undefined' || typeof req.body.czy_zarezerwowane === 'undefined'
            ) {

                res.status(400).send('JSON object is not defined.');
            }

            insertPost(req)
                .then(function(results) {

                    addedPostId = results.insertId;
                    console.log(addedPostId);

                    if (addedPostId > 0 && investmentId[0] > 0) {
                        var sql_taxonomy = 'INSERT INTO ew7xh_term_relationships ' +
                            '(object_id,term_taxonomy_id,term_order) ' +
                            'VALUES(?,?,0)';
                        var tax_inserts = [addedPostId, investmentId];
                        sql_tax = mysql.format(sql_taxonomy, tax_inserts);


                        var sql_lokal = 'INSERT INTO ew7xh_postmeta (' +
                            'post_id,meta_key,meta_value)' +
                            'VALUES (?,\'nr_lokalu\',?)';
                        var insert_lokal = [addedPostId, req.body.nr_lokalu];
                        sql_lokal = mysql.format(sql_lokal, insert_lokal);

                        var sql_miasto = 'INSERT INTO ew7xh_postmeta (' +
                            'post_id,meta_key,meta_value)' +
                            'VALUES (?,\'miasto\',?)';
                        var insert_miasto = [addedPostId, req.body.miasto];
                        sql_miasto = mysql.format(sql_miasto, insert_miasto);

                        var sql_powierzchnia_lokalu = 'INSERT INTO ew7xh_postmeta (' +
                            'post_id,meta_key,meta_value)' +
                            'VALUES (?,\'powierzchnia_lokalu\',?)';
                        var insert_powierzchnia_lokalu = [addedPostId, req.body.powierzchnia_lokalu];
                        sql_powierzchnia_lokalu = mysql.format(sql_powierzchnia_lokalu, insert_powierzchnia_lokalu);

                        var sql_liczba_pokoi = 'INSERT INTO ew7xh_postmeta (' +
                            'post_id,meta_key,meta_value)' +
                            'VALUES (?,\'liczba_pokoi\',?)';
                        var insert_liczba_pokoi = [addedPostId, req.body.liczba_pokoi];
                        sql_liczba_pokoi = mysql.format(sql_liczba_pokoi, insert_liczba_pokoi);

                        var sql_pietro = 'INSERT INTO ew7xh_postmeta (' +
                            'post_id,meta_key,meta_value)' +
                            'VALUES (?,\'pietro\',?)';
                        var insert_pietro = [addedPostId, req.body.pietro];
                        sql_pietro = mysql.format(sql_pietro, insert_pietro);

                        var sql_termin_oddania = 'INSERT INTO ew7xh_postmeta (' +
                            'post_id,meta_key,meta_value)' +
                            'VALUES (?,\'termin_oddania\',?)';
                        var insert_termin_oddania = [addedPostId, req.body.termin_oddania];
                        sql_termin_oddania = mysql.format(sql_termin_oddania, insert_termin_oddania);

                        var sql_powierzchnia_ogrodka = 'INSERT INTO ew7xh_postmeta (' +
                            'post_id,meta_key,meta_value)' +
                            'VALUES (?,\'powierzchnia_ogrodka\',?)';
                        var insert_powierzchnia_ogrodka = [addedPostId, req.body.powierzchnia_ogrodka];
                        sql_powierzchnia_ogrodka = mysql.format(sql_powierzchnia_ogrodka, insert_powierzchnia_ogrodka);

                        var sql_cena_brutto_m2 = 'INSERT INTO ew7xh_postmeta (' +
                            'post_id,meta_key,meta_value)' +
                            'VALUES (?,\'cena_brutto_m2\',?)';
                        var insert_cena_brutto_m2 = [addedPostId, req.body.cena_brutto_m2];
                        sql_cena_brutto_m2 = mysql.format(sql_cena_brutto_m2, insert_cena_brutto_m2);

                        var sql_cena_brutto = 'INSERT INTO ew7xh_postmeta (' +
                            'post_id,meta_key,meta_value)' +
                            'VALUES (?,\'cena_brutto\',?)';
                        var insert_cena_brutto = [addedPostId, req.body.cena_brutto];
                        sql_cena_brutto = mysql.format(sql_cena_brutto, insert_cena_brutto);

                        var sql_balkon = 'INSERT INTO ew7xh_postmeta (' +
                            'post_id,meta_key,meta_value)' +
                            'VALUES (?,\'balkon\',?)';
                        var insert_balkon = [addedPostId, req.body.balkon];
                        sql_balkon = mysql.format(sql_balkon, insert_balkon);

                        var sql_naglowek_mieszkania = 'INSERT INTO ew7xh_postmeta (' +
                            'post_id,meta_key,meta_value)' +
                            'VALUES (?,\'nagłowek_mieszkania\',?)';
                        var insert_naglowek_mieszkania = [addedPostId, req.body.naglowek_mieszkania];
                        sql_naglowek_mieszkania = mysql.format(sql_naglowek_mieszkania, insert_naglowek_mieszkania);

                        var sql_opis_mieszkania = 'INSERT INTO ew7xh_postmeta (' +
                            'post_id,meta_key,meta_value)' +
                            'VALUES (?,\'opis_mieszkania\',?)';
                        var insert_opis_mieszkania = [addedPostId, req.body.opis_mieszkania];
                        sql_opis_mieszkania = mysql.format(sql_opis_mieszkania, insert_opis_mieszkania);

                        var sql_dodatkowe_zdjecia = 'INSERT INTO ew7xh_postmeta (' +
                            'post_id,meta_key,meta_value)' +
                            'VALUES (?,\'dodatkowe_zdjęcia\',?)';
                        var insert_dodatkowe_zdjecia = [addedPostId, req.body.dodatkowe_zdjecia];
                        sql_dodatkowe_zdjecia = mysql.format(sql_dodatkowe_zdjecia, insert_dodatkowe_zdjecia);

                        var sql_czy_zarezerwowane = 'INSERT INTO ew7xh_postmeta (' +
                            'post_id,meta_key,meta_value)' +
                            'VALUES (?,\'czy_zarezerwowane\',?)';
                        var insert_czy_zarezerwowane = [addedPostId, req.body.czy_zarezerwowane];
                        sql_czy_zarezerwowane = mysql.format(sql_czy_zarezerwowane, insert_czy_zarezerwowane);


                        sql = sql_tax + ';' + sql_lokal + ';' + sql_miasto + ';' + sql_powierzchnia_lokalu + ';' +
                            sql_liczba_pokoi + ';' + sql_pietro + ';' + sql_termin_oddania + ';' + sql_powierzchnia_ogrodka + ';' +
                            sql_cena_brutto_m2 + ';' + sql_cena_brutto + ';' + sql_balkon + ';' + sql_naglowek_mieszkania + ';' +
                            sql_opis_mieszkania + ';' + sql_dodatkowe_zdjecia + ';' + sql_czy_zarezerwowane + ';';

                        console.log('sql output = ' + sql);

                        connection.query(sql, function (err, rows, fields) {
                            if (err) {
                                throw err;
                            }
                            if (!err) {
                                res.json(rows);
                            }
                            else
                                console.log('Error while performing Query.');
                        });


                    }else{
                        console.log(addedPostId);
                        console.log(investmentId[0]);
                    }
                })
                .catch(function(e){
                    console.log("ERROR");
                    console.log(e);
                });

        })

    /**
     * @api {put} /status-change/:offerId Request Offer status change
     * @apiName ChangeOfferStatus
     * @apiGroup Offers
     *
     * @apiParam {Number} id Post unique ID.
     *
     * @apiSuccess {Number} status 200.
     */
    offersRouter.route("/status-change/:offerId")
        .put(function (req, res) {


        })


    return offersRouter;
}


function insertPost(req){

    return new Promise(function(resolve, reject) {

        var connection = mysql.createConnection({
            host: 'webster.itecore.com',
            user: 'c1hanza_dev',
            password: 'Gndiw2sQDUS!',
            database: 'c1hanza_devdb',
            port: '3306',
            multipleStatements: true
        });

        var sql = 'INSERT INTO ew7xh_posts ' +
            ' (post_author, post_date, post_date_gmt,post_content,post_title, ' +
            ' post_excerpt,post_status,comment_status,ping_status,post_password, ' +
            ' post_name,to_ping,pinged,post_modified,post_modified_gmt,post_content_filtered, ' +
            ' post_parent,guid, menu_order, post_type,post_mime_type, comment_count) ' +
            ' VALUES (1, now(), now(), \'\' , ? , \'\', \'publish\', \'closed\', \'closed\', \'\', ?, \'\', \'\', now(), now(), \'\', ' +
            '0 , \'http://hanza.testhost.ovh/oferta/' + req.body.name.replace(/\s+/g, '-').toLowerCase() + '\', 200, \'oferta\', \'\', 0)';


        var inserts = [req.body.name, req.body.title];
        sql = mysql.format(sql, inserts);

        connection.query(sql, function (err, results, fields) {
            if (err) {
                throw err;
            }
            if (!err) {
                resolve(results);
            }
            else
                console.log('Error while performing Query.');
        });

    });
}


module.exports = routes;