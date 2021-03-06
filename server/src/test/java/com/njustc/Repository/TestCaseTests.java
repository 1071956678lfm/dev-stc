package com.njustc.Repository;


import com.njustc.FrameworkApplication;
import com.njustc.domain.Project;
import com.njustc.domain.TestCase;
import com.njustc.repository.ProjectRepository;
import com.njustc.repository.TestCaseRepository;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * 这个类用来测试TestCase类对应repository的增删查功能
 * <br>
 *<table border="1" summary="">
 *     <tr>
 *     <th><b>测试内容</b></th>
 *     <th><b>对应操作</b></th>
 *     <th><b>测试结果</b></th>
 *     </tr>
 *     <tr>
 *         <td>新建测试用例</td>
 *         <td>new + save</td>
 *         <td>FindById成功</td>
 *     </tr>
 *     <tr>
 *          <td>删除测试用例</td>
 *         <td>delete对应Id</td>
 *         <td>FindById为空</td>
 *      </tr>
 * </table>
 * @author FW
 */

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(FrameworkApplication.class)
//@Transactional
public class TestCaseTests {

    @Autowired
    private TestCaseRepository testCaseRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Test
    // @Transactional
    public void testTestCase(){
        TestCase testcase = new TestCase();
        testcase.setId("case");
        Project project = projectRepository.findById("test");

        testcase.setProject(project);
        projectRepository.save(project);
        testCaseRepository.save(testcase);
        TestCase testcasefind = testCaseRepository.findById("case");
        Assert.assertNotNull("testcase为空",testcasefind);

        testCaseRepository.save(testcase);
        testCaseRepository.delete("case");
        testcasefind = testCaseRepository.findById("case");
        Assert.assertNull("testcase不为空",testcasefind);
    }
}
