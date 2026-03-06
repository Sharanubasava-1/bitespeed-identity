import { Request, Response } from "express";
import pool from "../db/db";

export const identifyContact = async (req: Request, res: Response) => {

  const { email, phoneNumber } = req.body;

  const existing = await pool.query(
    `SELECT * FROM Contact
     WHERE email=$1 OR phoneNumber=$2`,
    [email, phoneNumber]
  );

  if (existing.rows.length === 0) {

    const newContact = await pool.query(
      `INSERT INTO Contact(email, phoneNumber, linkPrecedence)
       VALUES($1,$2,'primary') RETURNING *`,
      [email, phoneNumber]
    );

    return res.json({
      contact: {
        primaryContatctId: newContact.rows[0].id,
        emails: [email],
        phoneNumbers: [phoneNumber],
        secondaryContactIds: []
      }
    });

  }

  const primary = existing.rows[0];

  res.json({
    contact: {
      primaryContatctId: primary.id,
      emails: [...new Set(existing.rows.map((r: { email: any; }) => r.email).filter(Boolean))],
      phoneNumbers: [...new Set(existing.rows.map((r: { phonenumber: any; }) => r.phonenumber).filter(Boolean))],
      secondaryContactIds: existing.rows
        .filter((r: { linkprecedence: string; }) => r.linkprecedence === "secondary")
        .map((r: { id: any; }) => r.id)
    }
  });

};