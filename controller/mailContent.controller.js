exports.getInvitationMail = async function(sender, invitee_mail, invitationLink, title) {
    return `
    <div style="margin: 0; padding: 20px; width: 100%; background-color: #efefef">
        <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            style="margin: 0 auto; padding: 0; table-layout: fixed"
        >
            <tr>
            <td>
                <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                style="
                    margin: 0 auto;
                    padding: 0;
                    table-layout: fixed;
                    background-color: white;
                "
                >
                <tbody>
                    <tr
                    style="
                        border-collapse: collapse;
                        border-spacing: 0;
                        padding: 0;
                        margin: 0;
                    "
                    >
                    <td
                        style="
                        max-width: 500;
                        width: 600px;
                        border: 1px solid #e3e3e3;
                        padding: 25px;
                        "
                    >
                        <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="width: 100%"
                        >
                        <tbody>
                            <tr>
                            <td>
                                Hi ${invitee_mail},<br />
                                <b><i>${sender}</b></i> đã mời bạn tham gia công việc trong bài tuyển dụng
                                <b><i>${title}</i></b>.<br />
                                Hãy nhấn nút "Đồng ý" để chấp nhận lời mời này!
                            </td>
                            </tr>
                        </tbody>
                        </table>
                        <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="width: 100%"
                        >
                        <tbody>
                            <tr>
                            <td style="text-align: center; height: 80px">
                                <a
                                style="
                                    background-color: mediumblue;
                                    color: white;
                                    text-decoration: none;
                                    padding: 10px 20px;
                                    border-radius: 5px;
                                "
                                href="${invitationLink}"
                                >ĐỒNG Ý</a
                                >
                            </td>
                            </tr>
                        </tbody>
                        </table>
                        <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="width: 100%"
                        >
                        <tbody>
                            <tr>
                            <td style="text-align: center">
                                Nếu bạn không thể nhấn nút "Đồng ý" bên trên, <br />
                                hãy copy và paste link dưới đây trong thanh địa chỉ của trình duyệt!
                            </td>
                            </tr>
                        </tbody>
                        </table>
                        <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="width: 100%; margin: 10px 0px"
                        >
                        <tbody>
                            <tr>
                            <td style="text-align: center; font-size: 0.8em">
                                <a
                                href="${invitationLink}"
                                >
                                    ${invitationLink}
                                </a>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                        <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="width: 100%; margin-bottom: 20px"
                        >
                        <tbody>
                            <tr>
                            <td>
                                Cảm ơn bạn,<br />
                                KOLsMarketing System Team
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
                </table>
                <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                width="100%"
                style="width: 100%; margin-bottom: 20px; margin-top: 10px"
                >
                <tbody>
                    <tr>
                    <td style="text-align: center; color: #808080">
                        Đây là email tự động.
                        <br />
                        Bạn không cần trả lời email này. <br />
                        <br />
                        <i>KOLsMarketing System - 2022</i>
                    </td>
                    </tr>
                </tbody>
                </table>
            </td>
            </tr>
        </table>
    </div>
    `;
};
