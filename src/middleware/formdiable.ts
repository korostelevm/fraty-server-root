import fs from "fs";
import formidable from "formidable";

// resuable wrapper for formidable

export const parseForm = (req: any, res: any, next: any) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err: any, fields: any, files: any) => {
    if (err) {
      return res.status(500).json({
        message: "Error",
        error: err,
      });
    }
    req.body = fields;
    req.files = files;
    next();
  });
};
