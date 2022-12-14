import express from "express";
import BBS from "../models/tbl_bbs.js";
import moment from "moment";
const dateFormat = "YYYY-MM-DD";
const timeFormat = "HH:mm:ss";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // bbs 데이터 전체 SELECT
    const bbsResult = await BBS.find().sort({ b_date: -1, b_time: -1 });
    // SELECT 된 bbs 데이터(bbsResult)를
    // bbsList 변수에 담아서 index 에게 rendering 하기
    return res.render("board", { bbsList: bbsResult });
  } catch (err) {
    return res.json(err);
  }
});

router.get("/insert", (req, res) => {
  const bbs = new BBS();
  // moment 를 사용하여 현재 날짜 시각을
  // 지정한 format 형식의 문자열로 만들어서
  // 각각 b_date, b_time 칼럼에 추가하라
  bbs.b_date = moment().format(dateFormat);
  bbs.b_time = moment().format(timeFormat);
  res.render("write", { bbs });
});

router.post("/insert", async (req, res) => {
  const newBBS = new BBS(req.body);
  try {
    await newBBS.save();
    res.redirect("/board");
  } catch (err) {
    res.json(err);
  }
});

router.get("/detail/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let result = await BBS.findById(id);
    return res.render("detail", { bbs: result });
  } catch (err) {
    res.json(err);
  }
});

router.get("/update/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await BBS.findById(id);
    return res.render("write", { bbs: result });
  } catch (err) {
    console.error(err);
  }
});

router.post("/update/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await BBS.updateOne({ _id: id }, { $set: req.body });
    return res.redirect(`/board/detail/${id}`);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
});
router.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await BBS.findByIdAndDelete(id);
    return res.redirect("/board");
  } catch (err) {
    res.json(err);
  }
});

/**
 * router 의 RequestMethod
 * POST, PUT, GET, DELETE
 * POST: 처음 새로운 데이터를 서버로 보내서 INSERT 요청
 * PUT: 기존의 데이터를 UPDATE 요청
 * GET: 데이터를 클라이언트에서 요구할 때
 * DELETE: 기존 데이터를 삭제할 때
 */
router.put("/comment/add", async (req, res) => {
  const { id, ct_writer, ct_comment } = req.body;
  const commentData = {
    ct_comment,
    ct_writer,
    ct_date: moment().format(dateFormat),
    ct_time: moment().format(timeFormat),
  };
  console.log(id, ct_comment);

  try {
    // id 에 해당하는 데이터 찾기
    const bbs = await BBS.findById(id);
    // 기존의 댓글에 추가하기
    bbs.b_comments.push(commentData);
    await bbs.save();
    return res.json(bbs);
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
});

// DELETE RequostMethod 처리 Router
/**
 * 댓글 삭제하기
 * 조건: 한개의 게시글에 다수의 댓글(배열)이 저장된 상태
 * 1. bbsId 값으로 게시글을 SELECT 하고
 * 2. SELECT 된 게시글에 댓글이 있으면
 * 3. 댓글 배열 List 중에서 commId 값을 갖는 데이터를 삭제
 */
router.delete("/comment/:bbsId/:commId", async (req, res) => {
  const { bbsId, commId } = req.params;
  console.log("BBS", bbsId, "COMMENT", commId);

  try {
    //bbsId 에 해당하는 게시글 SELECT 하기
    const bbs = await BBS.findById(bbsId);
    // 게시글에서 comment 배열 추출하기
    const commentList = bbs.b_comments;
    /**
     * .commentList 데이터 중에서 _id 값이
     * commId 와 다른 데이터만 추출하여 resultList 에 담아라
     * 결과적으로 삭제하려고 하는 commId 에 해당하는 데이터는
     * 삭제된 채로 resultList 가 만들어질 것이다(filter).
     */
    // 배열 리스트 중에서 특정한(원하는) 값을
    // 포함하는 배열을 제거하고 새로운 배열로 복사하기
    const resultList = commentList.filter((comm) => {
      return comm._id != commId;
    });
    // 게시글의 원래 댓글 리스트와 교체
    bbs.b_comments = resultList;
    // 삭제된 리스트가 있는 bbs 를 저장하고
    await bbs.save();
    // 그 결과를 다시 Response
    return res.json(bbs);
  } catch (err) {
    console.error(err);
    return res.json(err);
  }
});

/* GET home page. */
router.get("/input", async (req, res, next) => {
  const bbsContent = {
    b_date: "2022-11-23",
    b_time: "09:36:00",
    b_writer: "polly",
    b_subject: "Mongoose 게시판 시작",
    b_content: "Mongoose 게시판 프로젝트",
  };
  try {
    /**
     * bbs 데이터(JSON)를 사용하여
     * mongoose 모델 객체 bbs 를 새로 생성하고
     * 모델 객체 bbs 의 save() 함수를 호출하여
     * 데이터를 추가하기
     */
    const bbs = new BBS(bbsContent);
    const result = await BBS.save;
    return res.json(result);
  } catch (err) {
    return res.json(err);
  }

  // res.render("index", { title: "callor.com Express" });
});

export default router;
