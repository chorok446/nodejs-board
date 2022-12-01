const request = require('supertest');
const {sequelize} = require('../models');
const app = require('../app');

beforeAll(async () => {
    await sequelize.sync();
});

describe('POST /join', () => {
    test('로그인 안 했으면 가입', (done) => {
        request(app)
            .post('/auth/join')
            .send({
                email: "example@naver.com",
                nick: '정동원',
                password: 'abc12345678-',
            })
            .expect('Location', '/')
            .expect(302, done)
    })
})

describe('POST /join', () => {
    const agent = request.agent(app);
    beforeEach((done)=> {
        agent
            .post('/auth/login')
            .send({
                email: "example@naver.com",
                password: "abcd12345678-",
            })
            .end(done);
    });



    test('이미 로그인했으면 redirect /', (done) => {
        const message = encodeURIComponent('로그인한 상태입니다.');
        agent
            .post('/auth/join')
            .send({
                email: "jana97@naver.com",
                nick: '정동원',
                password: 'abcd12345678-',
            })
            .expect('Location', `/?error=${message}`)
            .expect(302, done);
    });
});

describe('POST /login', () => {
    test('가입되지 않은 회원', (done) => {
        const message = encodeURIComponent('가입되지 않은 회원입니다.');
        request(app)
            .post('/auth/login')
            .send({
                email: 'wrongid@gmail.com',
                password: "abcd12345667-",
            })
            .expect('Location', `/?loginError=${message}`)
            .expect(302, done);
    });

        test('로그인 수행', (done) => {
            request(app)
                .post('/auth/login')
                .send({
                    email: 'exmaple@naver.com',
                    password: 'abcd12345678',
                })
                .expect('Location', '/')
                .expect(302, done);
        });

        test('비밀번호 틀림', (done) => {
            const message = encodeURIComponent('비밀번호가 틀렸습니다.');
            request(app)
                .post('/auth/login')
                .send({
                    email: 'jana97@naver.com',
                    password: 'wrongpassword',
                })
                .expect('Location', `/?loginError=${message}`)
                .expect(302, done);
        });
});

describe('GET /logout', () => {
    test('로그인되어 있지 않으면 403', (done) => {
        request(app)
            .get('/auth/logout')
            .expect(403, done);
    });

    const agent = request.agent(app);

})

describe('GET /logout', () => {
    test('로그인되어 있지 않으면 403', (done) => {
        request(app)
            .get('/auth/logout')
            .expect(403, done);
    });

    const agent = request.agent(app); // 로그인한 환경 만들기
    beforeEach((done) => {
        agent
            .post('/auth/login')
            .send({
                email:"jana97@naver.com",
                password: "abcd1234566788-",
            })
            .end(done);
    })

    test("로그아웃 수행", (done) => {
        const message = encodeURIComponent('비밀번호가 일치하지 않습니다.');
        agent
            .get('/auth/logout')
            .expect('Location', '/')
            .expect(302, done)
    });
});

// 테스트 다끝나고 db초기화
afterAll(async () => {
    await sequelize.sync({ force:true })
});
