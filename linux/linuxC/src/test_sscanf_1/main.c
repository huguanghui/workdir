/*
    sscanf中的匹配符问题
    1. *
        赋值抑制符:满足该条件的会被过滤掉
        %*[width][{h|l|L}]type
        type表示最大读取宽度
    2. 两种特殊字符
        []字符集合
        ^ 结束
*/
#include <stdio.h>
#include <string.h>

int main(int argc, char *argv[])
{
    FILE *fp = NULL;
    char buffer[80];

    fp = popen("cat /home/hgh/flash_update", "r");
    fgets(buffer, sizeof(buffer), fp);
    pclose(fp);

    printf("Str:%s\n", buffer);

    //int progress = 0;
    char tmp[80];
    
    //sscanf(buffer + strlen("total: %"), "%d", &progress);
    sscanf(buffer, "%*[a-zA-Z: %]%s", tmp);

    printf("Tmp:%s\n", tmp);
    //printf("Tmp:%d\n", progress);

    return 0;
}